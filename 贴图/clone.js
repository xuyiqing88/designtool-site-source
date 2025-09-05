/*
Author: Carlos O.
https://github.com/obrador/clone.js
Date: 22-Apr-2016
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
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
        
        var B = { 
            x: 0, y: 0,
            w: src_w, h: src_h
        };
        
        var offset = {
            x: offx || 0,
            y: offy || 0
        };

        var
        channels = 4,
        boundary = 'dirichlet',
        mode = mode || 'normal';

        function Point(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }

        function inBoundingBox(p, b) {
            return p.x >= b.x && p.x < b.x + b.w && p.y >= b.y && p.y < b.y + b.h;
        }

        function onBoundary(p, b) {
            return p.x === b.x-1 || p.x === b.x+b.w || p.y === b.y-1 || p.y === b.y+b.h;
        }

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
        
        var result = poisson(src_p, tar_p);

        function poisson(src, tar) {
            var N = B.w * B.h,
            x = {r: [], g: [], b: []};

            function getSafe(arr, x, y, w, h, defaultVal) {
                if (x < 0 || x >= w || y < 0 || y >= h) {
                    return defaultVal;
                }
                return arr[x + y * w];
            }

            for(var c in x) {
                var b = new Array(N);

                for(var i=0; i<N; i++) {
                    var p = new Point(B.x + i%B.w, B.y + Math.floor(i/B.w));
                    var v = 0, f = 0;

                    for(var j=0; j<4; j++) {
                        var q = new Point(p.x, p.y);
                        if(j === 0) q.x--;
                        else if(j === 1) q.x++;
                        else if(j === 2) q.y--;
                        else if(j === 3) q.y++;

                        if(!inBoundingBox(q, B)) {
                            var tar_x = offset.x + q.x;
                            var tar_y = offset.y + q.y;
                            var boundary_pixel = getSafe(tar, tar_x, tar_y, tar_w, tar_h, null);
                            if (boundary_pixel) {
                                f += boundary_pixel[c];
                            }
                        }
                    }

                    var src_val = src[p.x + p.y*src_w][c];
                    var tar_pixel = getSafe(tar, offset.x + p.x, offset.y + p.y, tar_w, tar_h, { [c]: src_val });
                    var tar_val = tar_pixel[c];

                    var n = [];
                    var lap_src = 0, lap_tar = 0;
                    
                    for(var j=0; j<4; j++) {
                        var q = new Point(p.x, p.y);
                        if(j === 0) q.x--;
                        else if(j === 1) q.x++;
                        else if(j === 2) q.y--;
                        else if(j === 3) q.y++;
                        n.push(q);
                    }

                    var s_neighbors = [
                        getSafe(src, n[0].x, n[0].y, src_w, src_h, { [c]: src_val }),
                        getSafe(src, n[1].x, n[1].y, src_w, src_h, { [c]: src_val }),
                        getSafe(src, n[2].x, n[2].y, src_w, src_h, { [c]: src_val }),
                        getSafe(src, n[3].x, n[3].y, src_w, src_h, { [c]: src_val })
                    ];

                    var t_neighbors = [
                        getSafe(tar, offset.x + n[0].x, offset.y + n[0].y, tar_w, tar_h, { [c]: tar_val }),
                        getSafe(tar, offset.x + n[1].x, offset.y + n[1].y, tar_w, tar_h, { [c]: tar_val }),
                        getSafe(tar, offset.x + n[2].x, offset.y + n[2].y, tar_w, tar_h, { [c]: tar_val }),
                        getSafe(tar, offset.x + n[3].x, offset.y + n[3].y, tar_w, tar_h, { [c]: tar_val })
                    ];
                    
                    lap_src = 4 * src_val - (s_neighbors[0][c] + s_neighbors[1][c] + s_neighbors[2][c] + s_neighbors[3][c]);
                    lap_tar = 4 * tar_val - (t_neighbors[0][c] + t_neighbors[1][c] + t_neighbors[2][c] + t_neighbors[3][c]);
                    
                    // ==========================================
                    // !! 最终的算法逻辑修正 !!
                    // ==========================================
                    if(mode === 'normal') v = lap_src;
                    else if(mode === 'mixed') {
                        v = Math.abs(lap_src) > Math.abs(lap_tar) ? lap_src : lap_tar;
                    }
                    else if(mode === 'seamless') {
                        // 之前的 'seamless' 逻辑有缺陷会导致黑边，
                        // 我们强制它使用标准的泊松融合算法，效果最稳定。
                        v = lap_src;
                    }

                    b[i] = v + f;
                }
                x[c] = jacobi(b);
            }
            return x;
        }

        function jacobi(b) {
            var x = b.slice(), x_ = b.slice();
            for(var k=0; k<50; k++) {
                for(var i=0; i<B.w*B.h; i++) {
                    var p = new Point(B.x + i%B.w, B.y + Math.floor(i/B.w));
                    var left = i-1, right = i+1, top = i-B.w, bottom = i+B.w;
                    
                    if(p.x - 1 < B.x) left = -1;
                    if(p.x + 1 >= B.x+B.w) right = -1;
                    if(p.y - 1 < B.y) top = -1;
                    if(p.y + 1 >= B.y+B.h) bottom = -1;

                    var val_left = left === -1 ? 0 : x_[left],
                    val_right = right === -1 ? 0 : x_[right],
                    val_top = top === -1 ? 0 : x_[top],
                    val_bottom = bottom === -1 ? 0 : x_[bottom];

                    var sum = val_left + val_right + val_top + val_bottom;
                    x[i] = (b[i] + sum) / 4;
                }
                x_ = x.slice();
            }
            return x;
        }

        for(var c in result) {
            for(var i=0; i<result[c].length; i++) {
                var p = new Point(B.x + i%B.w, B.y + Math.floor(i/B.w));
                var val = result[c][i];
                if(val < 0) val = 0;
                if(val > 255) val = 255;
                tar_data[channels*((offset.x+p.x) + (offset.y+p.y)*w) + (c==='r'?0:c==='g'?1:2)] = val;
            }
        }
        return tar;
    }

    return clone;
}));