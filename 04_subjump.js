title = "SUB JUMP";

description = `
[Hold]
 Go up & 
 Speed up
`;

characters = [
  `
   ll
   l
  lll
l l l
llllll
l lll
`,
  `
   ll
   l
  lll
  l l
llllll
  lll
`,
  `
 llll
ll lll
ll lll
ll lll
ll lll
 llll
`,
];

options = {
  theme: "shape",
  //theme: "crt",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 4,
};

/** @type {Vector[]} */

/** @type {"sea" | "land"} */
let landForm;
let nextLandFormDist;
let lvy;
/** @type {{pos: Vector, vel: Vector}} */
let sub;
/** @type {Vector[]} */
let coins;
let nextCoinDist;
let multiplier;

//***********************************
// 能取用的技巧總結：
// 1) 建立簡單山坡技巧
// 2) 循環捲軸山坡技巧
// 3) 調整建立山坡函數，達到需要的形狀
// 4) Player 在水底及空中的爬升與下降移動
//***********************************


//******************************************************
// 使用 n 個接點，建立地形(山坡)
// - 並配合循環捲軸使用
//******************************************************
const ScreenWidth = 100
const num = 10
const TotalSlice = num + 2
const slice = ScreenWidth / num
const TotalWidth = slice * TotalSlice; // extra 2 slice for buffer

let points = times(TotalSlice, (i) => vec(i * slice - slice, rnd(75, 85)));




function update() {
  if (!ticks) {
    landForm = "sea";
    nextLandFormDist = 50;
    lvy = 0;
    sub = { pos: vec(5, 60), vel: vec() };
    coins = [];
    nextCoinDist = 0;
    multiplier = 1;
  }
  
  
  // 水平面
  color("blue");
  rect(0, 50, 100, 2);

  
  
  //******************************************************
  // 畫面捲軸值
  // 1) player 超出特定位置，就需要捲軸畫面
  // 2) player 移動時超出多少，就捲軸多少
  // 3) 調整 player 捲軸後的位置
  //******************************************************
  let scr = 0;
  let pos = 10;
  if (sub.pos.x > pos) {		// 超出特定值
    scr = sub.pos.x	- pos		// 捲軸值，即超出多少
	sub.pos.x -= scr			// 調整 player 捲軸後位置
  }  
  
  
  
  
  //******************************************************
  // 循環捲軸地形
  // - scr 為捲軸值，scr 越大捲軸越快
  //******************************************************
  color("black");
  
  nextLandFormDist--;	// for hill function
  points.forEach((p,i) =>{
	var pp = points[wrap(i-1, 0, TotalSlice)];	// previous point
	p.x -= scr;									// scrolling
	if (p.x < -slice) {							// if out of screen
		p.x += TotalWidth;						// move to forward
		hill(pp,p);								// update hill or sea shape
	}
	if (pp.x < p.x)line(pp, p, 2);				// draw line
  })  
  
  
  

  
  
  //******************************************************
  // 控制 player
  // - 包括 player 在水底及空中，爬升/下降
  //******************************************************
  
  // 計算 Y
  let sd = 1.4			// 影響「爬升﹁及「下降」加速度，數值越大，加速度越強
  
  if (input.isPressed) {  // 爬升
		if (sub.pos.y > 50)	sub.vel.y -= sd * 0.06;	// 在水底時，爬升
		else 				sub.vel.y += sd * 0.01;	// 在空中時，下降慢一點
  } else {
		if (sub.pos.y > 50)	sub.vel.y += sd * 0.03;	// 在水底時，海底下潛(較慢)
		else				sub.vel.y += sd * 0.05;	// 在空中時，空中下跌(較快)
  }
  if(sub.pos.y>95)sub.pos.y=95
  
  
  // 計算 X
  sub.pos.x += 1.3
  
  // 保留之前 Y 值
  let py = sub.pos.y;
  
  // 按計算更新位置
  sub.vel.mul(sub.pos.y > 50 ? 0.95 : 0.99);
  sub.pos.add(sub.vel);
  




  //**************************************
  // Draw player
  //**************************************
  color("black");
  var chr = sub.pos.y < 50 ? "a" : addWithCharCode("a", floor(ticks / 7) % 2)
  var obj = char(chr,sub.pos)


  
  //**************************************
  // Handle colliding 
  //**************************************
  var c = obj.isColliding.rect
  if (c.black) {
    play("explosion");
    end();
  }  

  


  //**************************************
  // 水花
  //**************************************
  color("blue");
  // 入水的水花
  if (py > 50 && sub.pos.y < 50)
    particle(sub.pos.x, 50, 9, 1, -PI / 2, PI);
  
  // 上水面的水花
  if (py < 50 && sub.pos.y > 50)
    particle(sub.pos.x, 50, 9, 0.5, -PI / 2, PI);
  
  // 螺旋槳水花
  if (sub.pos.y > 55)
    particle(sub.pos.x - 3, sub.pos.y + 1, 0.3, 1, PI, 0.1);
  
  
}



function hill(pp,p){
	if (nextLandFormDist < 0) {
        landForm = landForm === "land" ? "sea" : "land";
        nextLandFormDist =
        rnd(200, 300) / (landForm === "land" ? 7 / sqrt(difficulty) : 1);
    }
	  
    if (landForm === "sea") {
        if (pp.y < 55)					lvy += 5;
        else if (pp.y < 65)				lvy += 3;
        else if (pp.y < 65 && lvy < 0)	lvy *= -0.5;
		else if (pp.y > 90 && lvy > 0)	lvy *= -0.5;
          
        p.y = pp.y + lvy;
        if (nextLandFormDist < 60) lvy += 4;
        
    } else {
        if (pp.y > 50)					lvy -= 5;
        else if (pp.y < 40 && lvy < 0)	lvy *= -0.5;
		else if (pp.y > 45 && lvy > 0)	lvy *= -0.5;
		
        p.y = pp.y + lvy / 3;
    }
	  
	p.y = clamp(p.y, 35, 95) + rnds(5);	
}