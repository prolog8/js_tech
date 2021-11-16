title = "TEST 02";

//*********************************
// 參考 aerialbar 中的鐘擺
//*********************************

description = `
Pendulum
`;

//characters = [];
//options = {};
//let nextBarDist;

let bars;
let ceilingY;

let once = true
let grav = 0.4
let ang = PI/3
let acc = 0
let vel = 0
let rope
let cen
let mg


function update() {
  if (!ticks) {
	// 繩索
	bars = [{ x: 50, length: 50, angle: PI / 2, angleVel: 0.03, isHeld: true }];
    
	// 天花板
	ceilingY = 10;	 
	
	// player
	player = {
      pos: vec(),
      length: 10,
      angle: 0,
      angleVel: 0,
      center: 0.2,
      bar: bars[0],
      vel: vec(),
    };
  }

  color("light_cyan");
  rect(0, 0, 100, ceilingY);
  
    
  
  remove(bars, (b) => {
	
  //*********************************
  // 鐘擺公式： 
  // https://www.khanacademy.org/science/high-school-physics/simple-harmonic-motion/simple-pendulums/a/simple-pendulum-ap1
  // 
  // F = -m * g * sin(angle)
  //
  // F ~ -m * g * angle   // A under 15 dergee, sin(A) ~= A
  // 
  //*********************************
	if(once){
		ang = PI/4					// 以圓周為基礎，物件初始角度 (份數越少，幅度越少)
		mg = 0.0055					// 物件重量連地心吸力 = mass * gravity (把數值合併)
		rope = b.length				// 繩索長度
		once = false
	}
								
	// Update
	cen = vec(b.x, ceilingY)	// 鐘擺的中心點 (由於 b.x 會移動，所以 cen 亦需更新)
	acc = -mg * ang				// 加速力
	vel += acc					// 速度
	ang += vel					// 角度

	
	b.angle = ang				// 備用
    color("black");
	
	
	// 計算繩索末端位置
	const p = vec(0, rope).rotate(ang).add(cen)
	
	
	//****************************
	// 計算 player 拉著繩索的位置
	// (即繩索末端位置)
	//****************************
	player.pos = p
	
	// 身體搖擺
	player.angleVel += b.angleVel * b.length * 0.003;
	player.angleVel *= 0.9;
	player.angle += player.angleVel;
	


	
	//****************************
	// Drawing
	//****************************
	// 繩索
    line(b.x, ceilingY, p);
    
	// 繩索末端
	box(p, 5)
	
	// Player
	color("cyan")
	bar(player.pos, player.length, 4, player.angle, player.center)
	
	
	
	
	//***********************************************
	// rotate 與 addWithAngle 均是順時針計算
	//***********************************************
	// var a45 = PI/4
	// var a90 = PI/2
	// var c2 = vec(40,10)
	
	// (1)
	//var t = vec(0,40).rotate(a45).add(c2)
	//line(40, 10, t)
	
	// (2)
	// addWithAngle 是順時針計算
	//var u = vec(0,0).addWithAngle(a90+a45, 40).add(c2)
	//line(40, 10, u)
	

  });
  
  
}
