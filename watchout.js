var _enemyCount = 1;
var data = [0, {distance: 21, inCollision: false}];

var score = 0;
var highscore = 0;
var collisions = 0;
var highlevel = 1;
var level = 1;
// start slingin' some d3 
var svg = d3.select(".container").append('svg')
  .attr('width', 800)
  .attr('height', 400);

svg.append('filter')
  .attr('id', 'enemy_image')
  .attr('x', '0%')
  .attr('y', '0%')
  .attr('width', '100%')
  .attr('height', '100%')
  .append('feImage')
  .attr('xlink:href', 'shuriken.png');
  
svg.append('filter')
  .attr('id', 'hero_image')
  .attr('x', '0%')
  .attr('y', '0%')
  .attr('width', '100%')
  .attr('height', '100%')
  .append('feImage')
  .attr('xlink:href', 'ninja.png');

svg.append('filter')
  .attr('id', 'background')
  .attr('x', '0%')
  .attr('y', '0%')
  .attr('width', '100%')
  .attr('height', '100%')
  .append('feImage')
  .attr('xlink:href', 'bamboo_back.jpg')

 
var background = svg.selectAll('rect').data([0, 1]).enter()
  .append('rect')
  .attr('filter', 'url(#background)')
  .attr('width', '800px')
  .attr('height', '400px')
  .style('opacity', '0.5')
  .attr('rx', '20px')
  .attr('ry', '20px')

var player = svg.selectAll('circle').data(data.slice(0,1)).enter()
  .append('circle').attr('r', 10)
  .attr('class', 'player')
  .attr('filter', 'url(#hero_image)')
  .attr('cx',-20)
  .attr('cy',-20)
  .call(d3.behavior.drag().on('drag', move));
  
player.transition().duration(2000)
  .attr('cx',150)
  .attr('cy',100)

var enemys = svg.selectAll('circle').data(data).enter()
  .append('circle').attr('r', 10)
  .attr('class', 'enemy')
  .attr('cx',400)
  .attr('cy',200)
  .attr('filter', 'url(#enemy_image)')


var mobility = function(){
  score++;
  if (highscore < score){
    highscore = score;
  }
  if (score > 0 && !(score % 5)) {
    level++;
    if (highlevel < level){
      highlevel = level;
    }
    data.push({distance: 21 + Math.random(), inCollision: false})
    svg.append('circle')
      .attr('class', 'enemy')
      .attr('cx',400)
      .attr('cy',200)
      .attr('r', 10)
      .attr('filter', 'url(#enemy_image)')
      .data({distance: 21, inCollision: false})
    
    svg.selectAll('circle').data(data);
  }
  d3.select(".current").select('span').text(score);
  d3.select(".high").select('span').text(highscore);
  d3.select(".currentlevel").select('span').text(level);
  d3.select(".highlevel").select('span').text(highlevel);
  d3.selectAll('.enemy').transition().duration(1000)
  .attr('cx',function(d){return Math.random()*800})
  .attr('cy',function(d){return Math.random()*400})
  setTimeout(mobility, 1000)
}
  
svg.selectAll('circle').data(data);

var detect = function(){
   d3.selectAll('.enemy').each(function (d) {
    var x1 = d3.select(this).attr('cx'),
        y1 = d3.select(this).attr('cy'),
        x2 = player.attr('cx'),
        y2 = player.attr('cy');
        
    d.distance = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    if(d.distance <= 20){
      if (!d.inCollision) {
        collisions++;
        d3.select(".collisions").select('span').text(collisions);
        d.inCollision = true;
      }
      level = 1;
      score = 0;
      svg.selectAll('.enemy').remove();
      svg.append('circle')
        .attr('class', 'enemy')
        .attr('cx',400)
        .attr('cy',200)
        .attr('r', 10)
        .attr('filter', 'url(#enemy_image)')
        .data({distance: 21, inCollision: false})
      
      data = [0, {distance: 21, inCollision: false}];
      
      svg.selectAll('circle').data(data);
        
      d3.select(".current").select('span').text(score);
      d3.select(".currentlevel").select('span').text(level);
    } else {
      d.inCollision = false;
    }
  });
}

function move () {
  var target = d3.select(this);
  target.attr('cx', function () {
    if (target.attr('cx') >= 790) {
      return 788;
    } else if (target.attr('cx') <= 10) {
      return 12;
    } else if(target.attr('cx') > 670 && target.attr('cy') < 90 ){
      return 665
    }
    return d3.event.dx + parseFloat(target.attr('cx')); })
  target.attr('cy', function () {
    if (target.attr('cy') >= 390) {
      return 388;
    } else if (target.attr('cy') <= 10) {
      return 12;
    } else if(target.attr('cx') > 680 && target.attr('cy') < 100 ){
      return 105;
    }
    return d3.event.dy + parseFloat(target.attr('cy')); })
}
 
mobility();
d3.timer(detect);

