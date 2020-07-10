var canvas = document.getElementById('simulation')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

var personArray = [];

var sickCount = 0;
var timeCount = 0;

var sickArray = [];
var timeArray = [];
var startTime = new Date().getTime();
var endTime;

console.log("width:" + canvas.width);
console.log("height:" + canvas.height);

// Chart
   
   var dps = []; // dataPoints
   var chart = new CanvasJS.Chart("chartContainer", {
       title :{
           text: "Dynamic Data"
       },
       axisX: {
           title: "Time"
       },
       axisY: {
           title: "No of sick",
           //logarithmic: true,
           //logarithmBase: 1000
       },     
       data: [{
           type: "area",
           dataPoints: dps
       }]
   });
   

function person(x, y, dx, dy, radius, color, health){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.health = health;  // 1 = Healthy, 2 = Sick, 3 = Recovering
    //this.ptype = ptype;    // 1 = 

    this.draw = function(){
        c.beginPath();
        c.arc( this.x, this.y, this.radius, 0, 2 * Math.PI, false );
        var r = Math.floor( Math.random() * 255 + 1);
        var g = Math.floor( Math.random() * 255 + 1);
        var b = Math.floor( Math.random() * 255 + 1);   
        //c.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.5 + ')';
        //c.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.5 + ')';   
        c.fillStyle = this.color ;
        c.strokeStyle = this.color ;
        c.fill();
        c.stroke();
        //console.log(this.y);
    }

    this.update = function() {
        
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
    
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    
        this.x += this.dx;
        this.y += this.dy;
        //console.log("in update");

        this.draw() ;
        this.collisionDetect();
    }

// define ball collision detection

    this.collisionDetect = function() {
        for(let j = 0; j < personArray.length; j++) {
            if(!(this === personArray[j])) {
                const diffx = this.x - personArray[j].x;
                const diffy = this.y - personArray[j].y;
                const distance = Math.sqrt(diffx * diffx + diffy * diffy);
  
                if (distance < this.radius + personArray[j].radius) {

                    if (personArray[j].health === '2') {

                        this.color = 'red';
                        this.health = '2';

                        this.dx = -this.dx;
                        this.dy = -this.dy;

                        this.x += this.dx;
                        this.y += this.dy;


                    }

                }
            }
        }
    }


}


var personArray = [];

var population = 100;

var randomSickPerson = Math.floor( Math.random() * population );
console.log(randomSickPerson);

for (var i = 0; i < population; i++) {

    var radius = 4;   
    var x = Math.random()* (innerWidth - radius * 1) + radius;
    var y = Math.random() * (innerHeight - radius * 1) + radius;
    var dx = (Math.random() - 0.5) * 3;
    var dy = (Math.random() - 0.5) * 3;

    if (i === randomSickPerson){
        personArray.push(new person(x, y, dx, dy, radius,'red','2'));
    }    
    else{    
        personArray.push(new person(x, y, dx, dy, radius,'green','1'));
    }

}

function animate() {
    requestAnimationFrame(animate);
    //console.log(x)
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (var i =0; i < personArray.length; i++) {
        personArray[i].update();

    }

    count();

} 

function count() {
    var lsickCount = 0;
    for (var i = 0; i < population; i++) {

        if (personArray[i].health === '2') {
            lsickCount = lsickCount + 1;
        }

    } 
    
    if (!(sickCount === lsickCount)) {
        sickCount = lsickCount;
        endTime = new Date().getTime();
        timeCount = (endTime - startTime) / 1000;       
        
        sickArray.push(sickCount);
        timeArray.push(timeCount);        

           dps.push({
               x: timeCount,
               y: sickCount
           });

           chart.render();

        //console.log(sickArray);
        //console.log(timeArray);
        //console.log("---");           
    }
}

animate(); 
