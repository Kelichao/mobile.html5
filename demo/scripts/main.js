/*!
 * @description: 活动页：K线训练营
 * @author: kelichao
 * @update: 2016-11-19
 */

;(function($) {
	
	// 数据模型
	var kModel = kit.Model({
		// 用户登录状态
		account: 0,
		// K线收割者连接,K线训练营首页地址  http://ozone.10jqka.com.cn
		jumpUrl: "/tg_templates/doubleone/2016/klinetc/game.html",

		// 正式地址  "http://ozone.10jqka.com.cn/tg_templates/doubleone/2016/klinetc/index.php"
		// 测试地址  "/caohaoyu/klinetc/index.php?"
		// 收益榜链接  
		tableUrl: "/tg_templates/doubleone/2016/klinetc/index.php",
		date: 20170223,// kit.timeHandle(new Date(), 0,""),
		// 短线宝地址
		sortUrl: "/tg_templates/vaserviece/mobileshortmessage/index.html?for=newjuece",

		// 收益榜参数
		tableParam: { 
			// 固定参数
		    "option":"getUserRank",
		    // 用户id
		    "userid": 311720498,
		    // 条数，这边也固定
		    "getCount":10 
		} 
	});

	// 控制器
	var kControl = kit.Controller({
		toOtherSite: function(url) {
			window.location.href = url || "";
		},
		ajaxInit: function() {
			return kit.ajaxConstant({
				beforeSend: function() {
					// somecode
					//$(".m-tb tbody").html("<tr><td colspan=3>数据加载中</td></tr>");
				},
				complete: function() {
					// somecode
					// $(".m-tb tbody").html("<tr><td colspan=3>暂无数据</td></tr>");
				}
			});
		},
		// 初始化字体大小，客户端原先注册的方法，属于hack
		initFontSize: function() {
			var os = getPlatform();

			if (os == "gphone") {
				callNativeHandler(
				    'webViewFontController',
				    '{"fontsize":"1", "switch":"0"}',
				    function(data) {
				    	// somecode
				    }
				);
			}
		},
		tempAjax: function() {
			// temp 中这两个方法通用
			var temp = this.ajaxInit();
			var _this = this;
			// 需要url,data,success
			temp({
				url: kModel.get("tableUrl"),
				data: kModel.get("tableParam"),
				success: function(resp) {
					_this.ajaxSuccess(resp);
				}
			});
		},
		// 埋点
		ta: function() {
			var id = "mkt_20170223_kxianspread";// 总id
			var ext = {url_ver: "SJCGBS-10735"};// 额外参数
			var openData = kit.mixin({id:id}, ext);
			//http://localhost:3000/source/kelichao/client.html?action=idcount^ts=1487593678&ld=mobile&platform=iphone&client_userid=0&opentime=1487593665&id=mkt_20170223_kxianspread.show&to_frameid=&to_resourcesid=&sp=1&dt=1&tt=1&rt=7&bt=16
			// 打开页面触发
			kit.ta_m(1, [openData]);

			// 跳转到其它页面
			kit.ta_m(3, {
				".u-enter": [id + ".top", "game_kxiantc_index"],
				".u-type1": [id + ".fenshi", "game_kxiantc_index"],
				".u-type2": [id + ".versus", "game_kxiantc_index"],
				".u-start": [id + ".middle", "game_kxiantc_index"],
				".u-demo": [id + ".chart", "game_kxiantc_index"],
				".u-click": [id + ".dxb", "mar_all_196"]
			},{
				url_ver: "SJCGBS-10735"
			});

			// 页面位置埋点
			this.pageHeight(".u-middle",function(){
				var _id = id + ".show";
				// var fina = kit.mixin({id: _id}, ext);
				kit.ta_m(2, [_id], ext);
			});
			this.pageHeight(".u-bottom", function() {
				var _id = id + ".bottom";
				// var fina = kit.mixin({id: _id}, ext)
				kit.ta_m(2, [_id], ext);
			});
		},
		// 高度计算函数
		pageHeight: function(total, callback) {
			var domHeight = $(total).offset().top;
			var fn = kit.once(callback);

			document.addEventListener("scroll", function() {
				var nowBottom = window.scrollY + document.documentElement.clientHeight;
				if (domHeight <= nowBottom) {
					fn();
				}
			});
		},
		// 请求成功事件
		ajaxSuccess: function(resp) {
			var arr;
			var temp = "";
			var classArr = ["u-first", "u-second", "u-third"];
			var render = function(cla, index, item, value) {

				var colorClass = "";
				if (cla !== undefined) {
					index = "";
					colorClass = "u-orange";
				}

				// 隐藏名字
				item = kControl.encryptName(item);

				return	"<tr>\
							<td class=" + cla + ">" + index + "</td>\
							<td class= " + colorClass + ">" + item + "</td><td class= " + colorClass + ">" + value + "</td>\
						</tr>";
				}
			
			console.log(resp);
			// 有数据
			if (resp.code == 0) {
				arr = resp.info.dayRank.rank;
				// 渲染表格
				if (arr.length > 0) {
					kit.forEach(arr, function(value, key) {
						temp += render(classArr[key], key+1, arr[key].nickName, arr[key].incomeRate);
					});
					$(".m-tb tbody").html(temp);
				} else {
					$(".m-tb tbody").html("<tr><td colspan=3>暂无数据</td></tr>");
				}
		
			} else {
				$(".m-tb tbody").html("<tr><td colspan=3>暂无数据</td></tr>");
			}
		},
		// 是否登录
		isSignIn: function() {

			//account的值为 0 或者 一个用户名
			var account = getAccount();
			kModel.set({account : account});
			if (kModel.get("account") == 0) {
				window.location.href = "http://eqhexin/changeUser";
			}
		},
		// 用户名加星号
		encryptName: function(nameparam){
		     var name = nameparam.toString();
		     var len = name.length;
		     var retName = '';
		     switch(len){
		         case 1:
		             retName = name;
		             break;
		         case 2:
		             var nameArr = name.split('');
		             retName = nameArr[0]+'*';
		             break;
		         case 3:
		             var nameArr = name.split('');
		             retName = nameArr[0]+'*'+nameArr[len-1];
		             break;
		         case 4:
		             var nameArr = name.split('');
		             retName = nameArr[0]+'**'+nameArr[len-1];
		             break;
		         case 5:
		             var nameArr = name.split('');
		             retName = nameArr[0]+'***'+nameArr[len-1];
		             break;
		         default:
		             var nameArr = name.split('');
		             retName = name.substr(0,len-4)+'***'+nameArr[len-1];
		             break;
		     }

		    return retName;
		 }
	});

	var kView = kit.View({
		initialize: function() {

			// 初始化事件
			kControl.subscribe({
				// 不需要参数的列队
				callback:["initFontSize", "ta", "tempAjax"],
				// 带参数的列队
				queue:{"": []}
			});
		},
		current:document,
		events: {
			".u-demo": "enter",// 大图跳转
			".u-enter": "enter",
			".u-start": "enter",
			".u-click": "short",
			".u-type2": "enter",
			".u-type1": "enter",
		},
		eventsFunction: {
			enter: function() {
				var account;

				// 判断并设置登录状态
				kControl.isSignIn();
				account = kModel.get("account");

				if (account == 0) {
					return ;
				}

				kControl.toOtherSite(kModel.get("jumpUrl"));
			},
			short: function() {
				kControl.toOtherSite(kModel.get("sortUrl"));
			}
		}
	}); 

})(Zepto);
// 打开触发
// hxmPageStat(id)

// 跳转手炒网页: hxmJumpPageStat(id1, id2)
// 跳转手炒客户端页: hxmJumpNativeStat(id1, id2)
// 非跳转点击埋点(hxmClickStat)