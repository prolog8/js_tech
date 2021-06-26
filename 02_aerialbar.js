title = "TEST 02";

//*********************************
// 參考 aerialbar 中的鐘擺
//*********************************

description = `
Pendulum
`;

characters = [];

options = {};

let bars;
let nextBarDist;

let player;
let flyingTicks;
let ceilingY;
let targetCeilingY;

let scr =  0.02;

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
	bars = [{ x: 50, length: 50, angle: PI / 2, angleVel: 0.03, isHeld: true }];
	nextBarDist = 0
    player = {
      pos: vec(),
      length: 10,
      angle: 0,
      angleVel: 0,
      center: 0.2,
      bar: bars[0],
      vel: vec(),
    };
    flyingTicks = 0;
    ceilingY = targetCeilingY = 10;	 
  }

  color("light_cyan");
  rect(0, 0, 100, ceilingY);
  color("light_blue");
  rect(0, 90, 100, 10);



  player.pos.x -= scr;
  if (player.bar != null) {
    const b = player.bar;
	
	
    //player.pos.set(b.x, ceilingY).addWithAngle(b.angle, b.length);
	
	//player.pos.set(b.x, ceilingY).addWithAngle(b.angle+PI/2, b.length);
	//vec(0, b.length).rotate(b.angle).add(b.x, ceilingY)
	
	player.pos = vec(0, b.length).rotate(b.angle).add(b.x, ceilingY)
	
    player.angleVel += b.angleVel * b.length * 0.003;
    if (b.x < 0) {
      color("red");
      text("X", 3, ceilingY);
      play("explosion");
      end();
    }
    if (input.isJustPressed) {
      play("select");
      player.vel
        .set()
        .addWithAngle(
          b.angle + PI / 2,
          (b.angleVel * b.length + player.angleVel * 3) * sqrt(difficulty)
        )
        .add(0, -sqrt(difficulty) * 0.5);
      player.bar = undefined;
      flyingTicks = 1;
    }
  } else {
    flyingTicks += difficulty;
    player.pos.add(player.vel);
    player.vel.y += (input.isPressed ? 0.01 : 0.1) * sqrt(difficulty);
    player.vel.mul(input.isPressed ? 0.99 : 0.95);
    if (player.pos.y > 89) {
      play("hit");
      player.vel.y *= -1.5;
      player.pos.y = 88;
      targetCeilingY += 10;
      flyingTicks = -9999;
      bars.forEach((b) => {
        b.isHeld = false;
      });
    }
    if (player.pos.x < 0) {
      color("red");
      text("X", 3, player.pos.y);
      play("explosion");
      end();
    }
  }  
  
  
  
  player.angleVel *= 0.99;
  player.angle += player.angleVel;
  color("cyan");
  if (
    bar(player.pos, player.length, 4, player.angle, player.center).isColliding
      .rect.light_cyan &&
    player.vel.y < 0
  ) {
    player.vel.y *= -0.5;
  }
  
  
  
  
  if (nextBarDist < 0) {
    const length = rnd(20, 50);
    bars.push({
      x: 50,
      length,
      angle: PI / 2 - rnd(PI / 4),
      angleVel: rnds(0.02, 0.04),
      isHeld: false,
    });
    nextBarDist = length + rnd(20);
  }
  
  
  // length: 50, angle: PI / 2, angleVel: 0.03
  
  
  
  remove(bars, (b) => {
    b.x -= scr;

    //b.angleVel += cos(b.angle) * b.length * 0.00005 * sqrt(difficulty);
	//b.angleVel += vel

	
  //*********************************
  // 鐘擺公式： https://www.khanacademy.org/science/high-school-physics/simple-harmonic-motion/simple-pendulums/a/simple-pendulum-ap1
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
	
	//const p = vec(0,0).addWithAngle(b.angle+a90, b.length).add(b.x, ceilingY);
	
	// 實際畫出線段
	const p = vec(0, rope).rotate(ang).add(cen)
	
	
    line(b.x, ceilingY, p);
    color(b.isHeld ? "black" : "blue");
    const c = box(p, 5).isColliding.rect;
    if (c.light_blue) {
      play("explosion");
      color("red");
      text("X", p);
      end();
    }
    if (!b.isHeld && player.bar == null && c.cyan) {
      play("powerUp");
      if (flyingTicks > 0) {
        addScore(ceil(flyingTicks), p);
      }
      player.bar = b;
      b.isHeld = true;
      targetCeilingY = clamp(targetCeilingY - 5, 10, 99);
    }
    return b.x < -30;
  });
  
  
}
