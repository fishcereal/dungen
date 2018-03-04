var globallandlist = [], globalentitylist = [], globallandcoordinates = [];
//an array used to make things randomly negative or positive
var negpos = [-1,1];
//array for making things either negative, positive, or nothing.
var steplist = [-1,0,1];
//simulate D4 roll. This could be done better in a function.
var d4list = [0,1,2,3];
var d5list = [0,1,2,3,4,5];
var tilesize,mapheight,mapwidth,border;
var a,b;

//Object arrays and their objects
var clouds = [], cloud, numberclouds, winddirection, cloudlowspeed, cloudhighspeed;
var oceans = [], ocean, oceanmod;
var continents = [], continent, numbercontinents, numbercontinenttiles;
var cows = [], cow, numbercows, cowtime;
var wanderers = [], wanderer, numberwanderers;
//variable to see if the mousepressed function should remove objects when pressed
//so it doesn't do it the first time
var mousepressedcount;



function setup() {
    //groups
    lands = new Group(); //group for land tiles
    landwalkers = new Group(); //group for objects that need to be constrained to land
    // noStroke();
    numberwanderers = 1;
    tick = 0;
    tilesize = 10;
    border = 10;
    mapwidth = 100;
    mapheight = 100;
    oceanmod = 20;
    numberclouds = random(1);
    cloudlowspeed = 1;
    cloudhighspeed = 2;
    mousepressedcount = 0;
    numbercontinents = 1;
    numbercontinenttiles = 100;
    numbercows = 0;
    cowtime = random(10,20);
    for (i = 0; i < mapwidth; i++){
        for(j = 0; j < mapheight; j++){
            globallandlist.push([j,i]);
            globalentitylist.push([j,i]);
        }
    }
    createCanvas((tilesize*mapwidth),tilesize*mapheight);
    background(100,100,200);
    mousePressed();
}



function mousePressed(){
    winddirection = random(negpos);
    console.log("pressed");
    //on mousepressed, empty object arrays unless none have been made
    if (mousepressedcount !=+0){

        for (i = 0; i < mapwidth; i++){
            for(j = 0; j < mapheight; j++){
                //globallandlist.push([0]);
                globallandlist[j][i] = 0;
                globalentitylist[j][i] = 0;
            }
        }
        globallandcoordinates = [];
        oceans = [];
        continents = [];
        clouds = [];
        cows = [];
        wanderers = [];
    }
    //make ocean
    //going to use a oceanmod number to make the ocean less taxing
    for (var i1 = 0; i1 < width; i1+=tilesize*oceanmod){
        for (var i2 = 0; i2 < height; i2+=tilesize*oceanmod){
            let x = i1;
            let y = i2;
            let ocean = new Ocean (x,y);
            oceans.push(ocean);
        }
    }

    //make a continent
    for (var i5 = 0; i5 < numbercontinents; i5++){
        let x = (mapwidth*tilesize)/2;
        let y = (mapheight*tilesize)/2;
        let size = numbercontinenttiles;
        let continent = new Continent (x,y,size);
        let loops = 1;
        continents.push(continent);
    }
    //make cows
    for (var i3 = 0; i3 < numbercows; i3++){
      //z will be random even number in globallandcoordinates list, an x coordinate. y will be z+1, a y coordinate.
        let z = wholeran((0,globallandcoordinates.length/2))*2;
        let x = globallandcoordinates[z]*tilesize;
        let y = globallandcoordinates[z+1]*tilesize;
        let time = cowtime;
        console.log('cow x: ' + x + '  cow y: '  +y)
        let cow = new Cow(x,y,time);
        cows.push(cow);
    }
    //make wanderers
    for (let i5 = 0; i5 < numberwanderers; i5++){
        let z = wholeran((0,globallandlist.length/2))*2;
        let x = mapwidth*tilesize/2;
        let y = mapheight*tilesize/2;
        let speed = 5;
        let size = tilesize;
        let wanderer = new Wanderer(x,y,speed,size);
        wanderers.push(wanderer);

    }
    //make clouds
    for (let i4 = 0; i4 < numberclouds; i4++){
        var cloudwhite = random(200,255);
        fill(cloudwhite,cloudwhite,cloudwhite,random(200,255));
        let x = randomtilerange(0,width-1);
        let y = randomtilerange(0,height);
        let lowspeed = cloudlowspeed;
        let highspeed = cloudhighspeed;
        let cloud = new Cloud(x,y,lowspeed,highspeed);
        clouds.push(cloud);
    }

    mousepressedcount += 1;
//end mousePressed()
}


function draw() {
    background(100,100,100);
    //update a bunch of object show() functions.
    // arrayShow(oceans);
    arrayShow(continents);
    arrayShow(clouds);
    arrayShow(cows);
    arrayShow(wanderers);
    fill(0);
    //try not drawing all sprites, but instead only drawing certain groups.

    // drawSprites();
    //noLoop();
    landwalkers.collide(lands);
}


//**************************************Utility Functions**************************************
//tile in random range
randomtilerange = function(low,high){
  a = tilesize*(Math.round(random(low/tilesize, high/tilesize)));
  return a;
};
//whole random number in range
wholeran = function(a,b){
    c = Math.round(random(a,b));
    return c;
};
//quickly loop through an array of objects and perform their show() functions.
arrayShow = function(array){
  for (i = 0; i < array.length; i++){
    array[i].show();
  }
};

//function to check four cardinal spaces around a tile for a value
ifany4 = function (array,x,y,value){
    arrayx = x/tilesize;
    arrayy = y/tilesize;
    if( array[arrayx +1][arrayy] == value || array[arrayx -1][arrayy] == value ||array[arrayx][arrayy+1] == value ||array[arrayx][arrayy-1] == value){
        return true;
    }
}
//function to check all 8 spaces around tile. Should be able to use this method
ifany8 = function(array,x,y,value){
  arrayx = x/tilesize;
  arrayy = y/tilesize;
  if ( array[arrayx +1][arrayy] == value || array[arrayx -1][arrayy] == value ||array[arrayx][arrayy+1] == value ||array[arrayx][arrayy-1] == value || array[arrayx-1][arrayy-1] == value || array[arrayx+1][arrayy-1] == value || array[arrayx-1][arrayy+1] == value || array[arrayx+1][arrayy+1] == value){
      return true;
  }
}



makeforest = function(x,y,numbertrees){
    // for (var i = 0; i < numbertrees;i++){
    //     fill(100,255,100);
    //     rect(x,y,tilesize,tilesize);
    //
    // }
}
