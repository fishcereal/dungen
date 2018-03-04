class Cloud {
    constructor(x,y,lowspeed,highspeed){
        this.x = x;
        this.y = y;
        this.lowspeed = lowspeed;
        this.highspeed = highspeed;
        this.speed = random(lowspeed,highspeed)*winddirection;
        this.lengthlow = 2;
        this.lengthhigh = 5;
        this.size = wholeran(this.lengthlow, this.lengthhigh);
    }

    show(){
    /*
    this is the lazy man's way of making 3 tiled clouds. This needs to be better.
    Remove the cloud from the array when it reaches past the screen
    make a new one using the function you had before, or make a new
    function for making clouds
    then put that cloud at some <0 x position and random y position

    cloud's shadows can currently draw over other clouds which looks bad.
    will have to make a different show() type function for clouds to draw before
    clouds so clouds draw ontop shadows (ocean > land > cow > shadow > cloud)
    */
    fill(255,255,255,255);
    rect(this.x,this.y,tilesize*this.size,tilesize);
    fill(50,50,50,50);
    rect(this.x,this.y+(tilesize*4),tilesize*this.size,tilesize);
    this.x += this.speed;
    }
    removecloud(movingright, movingleft){
        if (this.x > movingright && winddirection == 1 ){
            this.x = 0 - (random(tilesize*10,tilesize*20));
            this.speed = random(this.lowspeed,this.highspeed)*winddirection;
            this.size = wholeran(this.lengthlow, this.lengthhigh);
        }
        if (this.x < movingleft && winddirection == -1){
            this.x = width + (random(tilesize*3,tilesize*20));
            this.speed = random(this.lowspeed, this.highspeed)*winddirection;
            this.size = wholeran(this.lengthlow, this.lengthhigh);
        }
    }
  //end cloud class
}



class Ocean{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.r = 100;
        this.g = 100;
        this.b = random(200,255);
        this.alpha = random(240,250);
        this.alphachange = random(-.01,.01);
    }
    show(){
        //here we're going to mess with the ocean tiles alpha if it gets too dark or light
        fill(this.r,this.g,this.b,this.alpha);
        rect(this.x,this.y,tilesize*oceanmod,tilesize*oceanmod);
        // this.alpha+= this.alphachange;
        // if (this.alpha < 200){
        //     this.alphachange = random(.5,.1);
        // }
        // if (this.alpha > 255){
        //     this.alphachange = random(-.5,-.1);
        // }
    }
}


class Continent{
    constructor (x,y,size,loops){
        this.x = x;
        this.y = y;
        this.size = size;
        this.r = [];
        this.g = [];
        this.b = 0;
        this.loops = loops;
        this.arrayx = this.x/tilesize;
        this.arrayy = this.y/tilesize;
        this.drawarray = [];
        this.direction = random(d4list);

        //complicated noise variables start here!
        this.ioff = 0;
        this.noiseinc = 0.1;

        for (var i=0; i < this.size; i++){
            if (this.x> (mapwidth*tilesize)-(tilesize*3) || this.x < 0+tilesize || this.y > (mapheight*tilesize)-(tilesize*3) || this.y <0+tilesize){
                //x and y max need to be 3 tiles away from the edge because currently it's printing a 2x2 square, not 1x1
                this.x = randomtilerange(0+tilesize,(mapwidth*tilesize)-(tilesize*3) );
                this.y = randomtilerange(0+tilesize,(mapheight*tilesize)-(tilesize*3) );

            }
            this.arrayx = this.x/tilesize;
            this.arrayy = this.y/tilesize;
            //for one land list

            globallandlist[this.arrayx][this.arrayy]=1;
            globallandlist[this.arrayx][this.arrayy+1]=1;
            globallandlist[this.arrayx+1][this.arrayy+1]=1;
            globallandcoordinates.push(this.arrayx,this.arrayy,this.arrayx+1,this.arrayy,this.arrayx,this.arrayy+1,this.arrayx+1,this.arrayy+1);
            this.r.push(random(100,120));
            // var newLands = createSprite((this.arrayx)*tilesize,(this.arrayy)*tilesize);
            // newLands.addImage((loadImage("green40x40.png")));
            // lands.add(newLands);
            globallandlist[this.arrayx+1][this.arrayy]=1;
            this.g.push(100);
            //tried writing directional logic like the cow's below but kept getting an
            //assignment error with the landlist above. not sure why. This works for now.
            this.x += random(steplist)*tilesize;
            this.y += random(steplist)*tilesize;
                }
        for (var l = 0; l<mapwidth;l++){
            for (var j = 0; j<mapheight;j++){
                if (globallandlist[l][j]==1){
                    this.drawarray.push(l);
                    this.drawarray.push(j);
                }
            }
        }
    }
    show(){
        //make a separate array that contains all the coordinates where tiles are being drawn.
        for (var m = 0; m < this.drawarray.length;m+=2){
            fill(100+(m/4),1/2*noise(this.ioff)*m,100);
            rect(this.drawarray[m]*tilesize,this.drawarray[(m+1)]*tilesize,tilesize,tilesize);

        }

        // for (let i = 0; i < this.size; i++){
        //     //no clue why using noise and i is making red, but it makes more red the smaller you make it
        //     //like, the smaller you multiply it by
        //     //also I'm pretty sure I can make the color be based on the landlisty position
        //     fill(200,this.g[i]*noise(this.ioff)*i*.2,0);
        //     rect(this.landlistx[i],this.landlisty[i],tilesize,tilesize);
        //Use the line below to give the land tiles that groovy look
        //rect(this.landlistx[i],this.landlisty[i],tilesize*random(1,1.1),tilesize*random(1,1.1));
    }
}//end Continent class





class Cow{
    constructor(x,y,time){
        this.x = x;
        this.y = y;
        this.time = time;
        this.randomtimelow = 10;
        this.randomtimehigh = 20;
        this.arrayx = this.x/tilesize;
        this.arrayy = this.y/tilesize;
        this.r = random(100,255);
        this.g = 0;
        this.b = random(100,255);
        this.age = random(900,1000);
        this.agelimit = 10000;
        this.fertility = false;
    }
    show(){
        this.age+=1;
        this.arrayx = this.x/tilesize;
        this.arrayy = this.y/tilesize;
        globalentitylist[this.arrayx][this.arrayy] = 1;
        this.time -= 1;
        fill(0);
        this.direction = random(d4list);
        rect(this.x,this.y,tilesize,tilesize);
        //cow movement logic
        //move left
        if (this.time <= 0 && this.direction == 0){
            // //move left
            if (globallandlist[this.arrayx-1][this.arrayy] == 1 && globalentitylist[this.arrayx -1][this.arrayy] != 1){
                globalentitylist[this.arrayx][this.arrayy] = 0;
                this.x = this.x - tilesize;
                this.time = random(this.randomtimelow,this.randomtimehigh);
            }
        }
        //move right
        if (this.time <= 0 && this.direction == 1){
            if(globallandlist[(this.arrayx)+1][this.arrayy] == 1 && globalentitylist[(this.arrayx)+1][this.arrayy] !=1){
                globalentitylist[this.arrayx][this.arrayy] = 0;
                this.x = this.x+tilesize;
                this.time = random(this.randomtimelow, this.randomtimehigh);
            }
        }
        //move up
        if (this.time <= 0 && this.direction == 2){
            if(globallandlist[this.arrayx][this.arrayy-1] == 1 && globalentitylist[this.arrayx][this.arrayy-1] != 1){
                globalentitylist[this.arrayx][this.arrayy] = 0;
                this.y = this.y-tilesize;
                this.time = random(this.randomtimelow, this.randomtimehigh);
            }
        }
        //move down
        if (this.time <= 0 && this.direction == 3){
            if(globallandlist[this.arrayx][this.arrayy+1] == 1 && globalentitylist[this.arrayx][this.arrayy+1] != 1){
                globalentitylist[this.arrayx][this.arrayy] = 0;
                this.y = this.y+tilesize;
                this.time = random(this.randomtimelow, this.randomtimehigh);

            }
        }

        for(var i = 0; i < cows.length; i++){
            if(cows[i].age >=this.agelimit){
                cows.splice(i);
            }
        }
        if (this.age > 2000){
            this.fertility = true;
        }
        if (ifany8(globalentitylist,this.x,this.y,1) && this.fertility === true){
            let z = wholeran((0,globallandcoordinates.length/2))*2;
            let x = globallandcoordinates[z]*tilesize;
            let y = globallandcoordinates[z+1]*tilesize;
            let time = cowtime;
            let age = 0;
            let cow = new Cow(x,y,time,age);
            cows.push(cow);
            this.fertility = false;
            console.log('a cow was born!' + cows.length);
            console.log (x + '  ' + y);
            this.age+=2000;
        }
    }
}//end cow class


class Wanderer {
  constructor(x,y,speed,size){
    this.x = x;
    this.y = y;
    this.speed = tilesize;
    //higher rate means it'll move slower
    this.rate = 10;
    this.speedcounter = this.rate;
    this.size = size;
    this.arrayx = this.x/tilesize;
    this.arrayy = this.y/tilesize;
    this.dx;
    this.dy;
    this.mod;
    this.direction = random(d4list);
    this.time;
    this.left;
    this.right;
    this.up;
    this.down;
    // var newLandWalker = createSprite(this.x,this.y,tilesize,tilesize);
    // landwalkers.add(newLandWalker);

  }
  show(){
    this.arrayx = this.x/tilesize;
    this.arrayy = this.y/tilesize;
    fill(0);
    this.speedcounter -=1;
    // this.direction = random(d4list);
    // this.time = 0;
    //         if (this.time <= 0 && this.direction == 0){
    //         // //move left
    //         if (globallandlist[this.arrayx-1][this.arrayy] == 1 && globalentitylist[this.arrayx -1][this.arrayy] != 1){
    //             globalentitylist[this.arrayx][this.arrayy] = 0;
    //             this.x = this.x - tilesize;
    //             // this.time = random(this.randomtimelow,this.randomtimehigh);
    //         }
    //     }
    //     //move right
    //     if (this.time <= 0 && this.direction == 1){
    //         if(globallandlist[(this.arrayx)+1][this.arrayy] == 1 && globalentitylist[(this.arrayx)+1][this.arrayy] !=1){
    //             globalentitylist[this.arrayx][this.arrayy] = 0;
    //             this.x = this.x+tilesize;
    //             // this.time = random(this.randomtimelow, this.randomtimehigh);
    //         }
    //     }
    //     //move up
    //     if (this.time <= 0 && this.direction == 2){
    //         if(globallandlist[this.arrayx][this.arrayy-1] == 1 && globalentitylist[this.arrayx][this.arrayy-1] != 1){
    //             globalentitylist[this.arrayx][this.arrayy] = 0;
    //             this.y = this.y-tilesize;
    //             // this.time = random(this.randomtimelow, this.randomtimehigh);
    //         }
    //     }
    //     //move down
    //     if (this.time <= 0 && this.direction == 3){
    //         if(globallandlist[this.arrayx][this.arrayy+1] == 1 && globalentitylist[this.arrayx][this.arrayy+1] != 1){
    //             globalentitylist[this.arrayx][this.arrayy] = 0;
    //             this.y = this.y+tilesize;
    //             // this.time = random(this.randomtimelow, this.randomtimehigh);
    //
    //         }
    //     }


    if (this.x % tilesize === 0 && this.y % tilesize === 0){
      this.mod = true;
      // console.log('true')
    }else{
      this.mod = false;
      this.direction = random(d4list);
      console.log(this.x % tilesize + '  ' +this.arrayy);
    }
    //left
    if(this.mod && globallandlist[(this.arrayx)-1][this.arrayy] ==1){
        // this.x -= this.speed;
        this.left=true;
    }else{
        this.left = false;
        this.direction = random(d4list);
    }
    //right
    if (this.mod && globallandlist[this.arrayx+1][this.arrayy] == 1){
      this.right=true;
    } else {
      this.right = false;
      this.direction = random(d4list);
    }
    //up
    if (this.mod && globallandlist[this.arrayx][this.arrayy-1] == 1){
      this.up=true;
    } else {
      this.up = false;
      this.direction = random(d4list);
    }
    //down
    if (this.mod && globallandlist[this.arrayx][this.arrayy+1] == 1){
      this.down=true;
    } else {
      this.down = false;
      this.direction = random(d4list);
    }
    if (this.direction == 0 && this.left && this.speedcounter <= 0){
        this.x-=this.speed;
        this.y+=0;
        console.log('left');
        this.speedcounter = this.rate;
        this.direction = random(d4list);
        console.log(this.speedcounter);
    }
    if (this.direction == 1 && this.right && this.speedcounter <= 0){
        this.x+=this.speed;
        this.y+=0;
        console.log('right');
        this.speedcounter = this.rate;
        this.direction = random(d4list);
    }
    if (this.direction == 2 && this.up && this.speedcounter <= 0){
        this.x +=0;
        this.y-=this.speed;
        console.log('up');
        this.speedcounter = this.rate;
        this.direction = random(d4list);
    }
    if (this.direction == 3 && this.down && this.speedcounter <= 0){
        this.x +=0;
        this.y+= this.speed;
        console.log('down');
        this.speedcounter = this.rate;
        this.direction = random(d4list);
    }
    rect(this.x,this.y,tilesize,tilesize);

  }
}
