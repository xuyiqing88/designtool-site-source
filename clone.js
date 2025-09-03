/*
Author: Carlos O.
https://github.com/obrador/clone.js
Date: 22-Apr-2016
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.clone = factory();
  }
}(this, function () {

    function clone(src, tar, w, mode, offx, offy) {
        var
        src_data = src.data,
        tar_data = tar.data,
        src_w = src.width,
        src_h = src.height,
        tar_w = tar.width,
        tar_h = tar.height;
        
        var src_p = [], tar_p = [];
        
        // bounding box of the source that will be copied
        // can be the entire image or a smaller portion
        var B = { 
            x: 0, y: 0,
            w: src_w, h: src_h
        };
        
        // offset of the source on the target
        // (the location where the source will be placed)
        var offset = {
            x: offx || 0,
            y: offy || 0
        };

        var
        // number of channels
        channels = 4,
        
        // boundary condition
        boundary = 'dirichlet', // or neumann
        
        // cloning mode
        mode = mode || 'normal';

        function Point(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }

        function
        // check if a point is inside a bounding box
        inBoundingBox(p, b) {
            return p.x >= b.x && p.x < b.x + b.w && p.y >= b.y && p.y < b.y + h;
        }

        function
        // check if a point is on the boundary of a bounding box
        // we are adding a 1 px border around the source image
        onBoundary(p, b) {
            return p.x === b.x-1 || p.x === b.x+b.w || p.y === b.y-1 || p.y === b.y+b.h;
        }

        // prepare the source and target pixels
        // by creating a buffer array
        for(var i=0; i<src_w*src_h*channels; i+=channels) {
            src_p.push({
                r: src_data[i],
                g: src_data[i+1],
                b: src_data[i+2]
            });
        }
        
        for(var i=0; i<tar_w*tar_h*channels; i+=channels) {
            tar_p.push({
                r: tar_data[i],
                g: tar_data[i+1],
                b: tar_data[i+2]
            });
        }
        
        // start the poisson solver
        var result = poisson(src_p, tar_p);

        function
        // the main poisson solver
        poisson(src, tar) {

            // we will be solving the laplacian in the gradient domain
            // the source will be copied on the target, and the source is B.w * B.h
            // so we will have as many variables as pixels to be copied
            var
            N = B.w * B.h,
            
            // store the solution here
            x = {r: [], g: [], b: []};

            // for each color channel
            for(var c in x) {
                // Ax = b
                // where A is the laplacian matrix, b is the guidance field
                // and x is the solution (the final pixel values)
                var
                b = new Array(N);

                // build the b vector
                for(var i=0; i<N; i++) {

                    var
                    // the i-th pixel in the bounding box
                    p = new Point(B.x + i%B.w, B.y + Math.floor(i/B.w));
                    
                    var
                    // value of the guidance field
                    v = 0,
                    
                    // value of the boundary
                    f = 0;

                    // get the boundary condition
                    // for all the neighbors of p
                    for(var j=0; j<4; j++) {
                        // the j-th neighbor of p
                        var
                        q = new Point(p.x, p.y);
                        
                        // left, right, top, bottom
                        if(j === 0) q.x--;
                        else if(j === 1) q.x++;
                        else if(j === 2) q.y--;
                        else if(j === 3) q.y++;

                        // if the neighbor is on the boundary
                        if(!inBoundingBox(q, B)) {
                            // in this case, the pixel value is known
                            // so we can add it to the b vector
                            f += tar_p[ (offset.x+q.x) + (offset.y+q.y) * w ][c];
                        }
                    }

                    // get the guidance field
                    var
                    // p-th pixel in the source and target
                    src_val = src[p.x + p.y*src_w][c],
                    tar_val = tar[(offset.x+p.x) + (offset.y+p.y)*w][c];

                    // p's neighbors
                    var
                    n = [],
                    
                    // src laplacian
                    lap_src = 0,
                    
                    // tar laplacian
                    lap_tar = 0;
                    
                    for(var j=0; j<4; j++) {
                        var q = new Point(p.x, p.y);
                        if(j === 0) q.x--;
                        else if(j === 1) q.x++;
                        else if(j === 2) q.y--;
                        else if(j === 3) q.y++;
                        
                        n.push(q);
                    }

                    lap_src = 4 * src_val
                        - src[n[0].x + n[0].y*src_w][c]
                        - src[n[1].x + n[1].y*src_w][c]
                        - src[n[2].x + n[2].y*src_w][c]
                        - src[n[3].x + n[3].y*src_w][c];
                    
                    lap_tar = 4 * tar_val
                        - tar[(offset.x+n[0].x) + (offset.y+n[0].y)*w][c]
                        - tar[(offset.x+n[1].x) + (offset.y+n[1].y)*w][c]
                        - tar[(offset.x+n[2].x) + (offset.y+n[2].y)*w][c]
                        - tar[(offset.x+n[3].x) + (offset.y+n[3].y)*w][c];
                    
                    // guidance field
                    // based on the cloning mode
                    if(mode === 'normal') v = lap_src;
                    else if(mode === 'mixed') {
                        v = Math.abs(lap_src) > Math.abs(lap_tar) ? lap_src : lap_tar;
                    }
                    else if(mode === 'seamless') { // my own implementation
                        v = lap_src; // source gradient
                        
                        // if the color of the source is very different from the color of the target
                        // use the target's gradient, otherwise use a mix of both
                        if(Math.abs(src_val - tar_val) > 32)
                        v = lap_tar; // target gradient
                    }

                    // update the b vector
                    b[i] = v + f;
                }

                // solve for x, given b
                // using jacobi relaxation
                x[c] = jacobi(b);
            }

            // we are done, return the solution
            return x;
        }

        function
        // jacobi relaxation
        // solves Ax=b for x
        // A is the laplacian matrix
        jacobi(b) {
            var
            // clone of b, to store the solution
            x = b.slice(),
            
            // used for convergence test
            x_ = b.slice();

            // repeat 50 times
            for(var k=0; k<50; k++) {
                
                // for each pixel in the bounding box
                for(var i=0; i<B.w*B.h; i++) {
                    var
                    // sum of the neighbors
                    sum = 0,
                    
                    // the i-th pixel in the bounding box
                    p = new Point(B.x + i%B.w, B.y + Math.floor(i/B.w));

                    // get the neighbors
                    var
                    left = i-1, right = i+1,
                    top = i-B.w, bottom = i+B.w;
                    
                    if(p.x - 1 < B.x) left = -1;
                    if(p.x + 1 >= B.x+B.w) right = -1;
                    if(p.y - 1 < B.y) top = -1;
                    if(p.y + 1 >= B.y+B.h) bottom = -1;

                    var
                    val_left = left === -1 ? 0 : x_[left],
                    val_right = right === -1 ? 0 : x_[right],
                    val_top = top === -1 ? 0 : x_[top],
                    val_bottom = bottom === -1 ? 0 : x_[bottom];

                    sum = val_left + val_right + val_top + val_bottom;

                    x[i] = (b[i] + sum) / 4;
                }
                x_ = x.slice();
            }
            return x;
        }

        // copy the solution to the target
        for(var c in result) {
            for(var i=0; i<result[c].length; i++) {
                var
                p = new Point(B.x + i%B.w, B.y + Math.floor(i/B.w));
                
                var
                val = result[c][i];

                if(val < 0) val = 0;
                if(val > 255) val = 255;
                
                tar_data[channels*((offset.x+p.x) + (offset.y+p.y)*w) + (c==='r'?0:c==='g'?1:2)] = val;
            }
        }
        return tar;
    }

    return clone;
}));