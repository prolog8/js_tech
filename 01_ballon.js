title = "TEST 01";

description = `
Testing 01
`;

characters = [];

options = {};

//*********************************
// 參考 balloon 中得出的技巧
//*********************************

let balloons;
let addBalloonTicks;
let prevInputPos;
let wind;
let bonuses;
let addBonusTicks;
let multiplier;
let scoreTotal;
let scorePos;

var a=0

function update() {
  if (!ticks) {
	 
  }
  
  var c = vec(50,50)
  var a90 = PI/2
  var a360 = 2*PI
  var f
  var num
  
  color("green");
  text("o", c);
  
  //*********************************
  // 重點：
  // 1) 依圓周均等分配 n 個點
  // 2) 求每個點面向中心點的角度
  // 
  //*********************************
  num = 8
  f = a360/num
  
  times(num, (i)=>{
	var r = i*f
	var p = vec(30,0).rotate(r).add(c)
	
	bar(p,6,3, r+a90)
  })
  
 
  //*********************************
  // 加上移動
  //*********************************
  color("blue");

  num = 6
  f = a360/num
  times(num, (i)=>{
	var r = i*f+a
	var p = vec(20,0).rotate(r).add(c)
	//var p = vec(c).addWithAngle(r,20)
	
	bar(p,12,3, r)
	a += 0.003
  })
  
  
  
}
