/**
 * author wenqingxin
 * date   2017/4/3
 * 手写签名插件
 */

(function(window){
	if(!window.Signature){
		var
		_canvas,
		_context,
		_log_head = "Signature:",
		_is_mouse_down = false,
		_last_pos = {x:0,y:0},
		_attrs = {
			width:document.body.clientWidth,
			height:400,
			drawWidth:15,
			drawColor:'red',
			//showBorder:true,
			borderWidth:1,
			borderColor:'red'
		};

		//画框
		function _draw_grid(){
				//设置画布大小
				_canvas.width = _attrs.width;
				_canvas.height = _attrs.height;
/*				if(_attrs.showBorder){
					_context.save();//保留当前状态

					//声明线条颜色
					_context.strokeStyle = _attrs.borderColor;
					//开始绘制外边框
					_context.beginPath();
					_context.moveTo(_attrs.borderWidth / 2,_attrs.borderWidth / 2);
					_context.lineTo(_attrs.width - _attrs.borderWidth / 2 , _attrs.borderWidth / 2);
					_context.lineTo(_attrs.width - _attrs.borderWidth / 2,_canvas.height - _attrs.borderWidth / 2);
					_context.lineTo(_attrs.borderWidth / 2 ,_canvas.height - _attrs.borderWidth / 2);
					_context.closePath();//闭合路径
					//设置边框粗细
					_context.lineWidth = _attrs.borderWidth;//线条

					_context.stroke();

					_context.restore();//把当前状态还原成原始状态
				}*/

				return true;
		}

		//手写开始调用函数
		function _draw_start(pos){
				_is_mouse_down= true;
				//第一次mousedown,记录位置作为起点
				_last_pos = _transform_axios(pos.x,pos.y);
		}
		//手写移动调用该函数
		function _draw_move(pos){
					_cur_pos = _transform_axios(pos.x,pos.y);					
					//绘制画笔路径
					_context.beginPath();
					_context.moveTo(_last_pos.x,_last_pos.y);
					_context.lineTo(_cur_pos.x,_cur_pos.y);
					_context.strokeStyle =_attrs.drawColor;
					_context.lineWidth = _attrs.drawWidth ;
					//防止线条太祖后出现矩形边缘
					_context.lineCap = "round";
					_context.lineJoin = "round";
					_context.stroke();
					//每次绘制一下就记录上一次位置作为起点
					_last_pos = _cur_pos;
		}
		//手写结束调用函数
		function _draw_end(){
				_is_mouse_down=false;
		}
		//监听事件
		function _listen_action(){
			_canvas.onmousedown = function(e){
				e.preventDefault();
				console.log('mouse down');
				_draw_start({x:e.clientX,y:e.clientY})
			}
			_canvas.onmouseup = function(e){
				e.preventDefault();
				console.log('mouse up');
				_draw_end();
			}
			_canvas.onmousemove = function(e){
				e.preventDefault();				
				if(_is_mouse_down){
					console.log('mouse move');
					_draw_move({x:e.clientX,y:e.clientY})
				}
			}
			_canvas.onmouseout = function(e){
				e.preventDefault();
				console.log('mouse out');
				_draw_end();
			}
		}
		//移动端监听事件
		function _mobile_listen_action(){
			_canvas.addEventListener('touchstart',function(e){
				e.preventDefault();
				console.log('start')
				_draw_start({
					x:e.touches[0].pageX,
					y:e.touches[0].pageY
				});			
			});			
			_canvas.addEventListener('touchmove',function(e){
				e.preventDefault();
				console.log('move')		
				_draw_move({
					x:e.touches[0].pageX,
					y:e.touches[0].pageY
				})						
			});			
			_canvas.addEventListener('touchend',function(e){
				e.preventDefault();
				console.log('end');
				_draw_end();
			});
		}
		//坐标系转换，将屏幕坐标系转化成为canvas的坐标系
		function _transform_axios(x,y){
			var _canvas_container = _canvas.getBoundingClientRect();
			//屏幕坐标系减去包围盒边距
			return {
				x : Math.round(x - _canvas_container.left),
				y : Math.round(y - _canvas_container.top)
			}
		}
		//初始化设置定制属性
		function setAttr(attrs){
			for(var attr in attrs){
				//alert(_attrs[attr]);
				if(_attrs[attr]){
					_attrs[attr] = attrs[attr];
				}
			}
			//alert(JSON.stringify(_attrs));
			//_draw_grid();
		}
		//暴露Signature对象
		window.Signature = {
			//初始化方法
			init : function(id,attrs){
				_canvas = document.getElementById(id);
				if(!_canvas) {
					console.log(_log_head + 'can not find element,make sure import signature.js on the bottom of document !');
					return false;
				}
				_context = _canvas.getContext('2d');
				if(!_context) {
					console.log(_log_head + "your brower does't suport canvas");
					return false;
				};
				if(attrs){
					setAttr(attrs);
				}
				if(_draw_grid(_canvas)){
					_mobile_listen_action();
					_listen_action();
				} 			
/*				_context.font="40px Arial";
				_context.fillText("Hello World",10,50);*/
			},
			//清除画布
			clear : function(){
				_context.clearRect(0,0,_attrs.width,_attrs.height);
				_draw_grid();
			},
			//保存签名
			gerUrlData : function(){
				var _data_url = _canvas.toDataURL('image/png');
				//alert(_data_url);
				console.log(_data_url);
			},
			//导入签名
			setUrlData : function(_img_data){

				var img = new Image();   // 创建img元素

				img.onload = function(){
				  // 执行drawImage语句
				  _context.drawImage(img,(document.body.clientWidth-img.width)/2,0);
				}
				img.src = _img_data; // 设置图片源地址

			},
			//个性化设置
			setColor:function(color){
				_attrs.drawColor = color;				
			}
		}
	}
})(window);

