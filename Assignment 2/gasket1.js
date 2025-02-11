"use strict";

var gl;
var points;
var step = 500;
var maxPoints = 5000;
var minPoints = 500;
var currentPoints = minPoints;
var NumPoints = 5000;
var color ;
var delay ;
var get_ss;

window.onload = function init()
{

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    var status_text = document.getElementById('status_text');
    status_text.value = 'Click Start';

function updatePoints(){
    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    
    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    points = [ p ];
    for ( var i = 0; points.length < currentPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push( p );
    }

    var vertexSource = `attribute vec4 vPosition;
    void
    main()
    {
        gl_PointSize = 1.0;
        gl_Position = vPosition;
    }`;
	
	var fragmentSource = `precision mediump float;
    uniform vec4 uni_color;	
    
    void
    main()
    {
        
        gl_FragColor = uni_color;
        
        
    }`;
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader,vertexSource);
	gl.compileShader(vertexShader);
	
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader,fragmentSource);
	gl.compileShader(fragmentShader);
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
    gl.useProgram( program );
    var colorLocation = gl.getUniformLocation(program, "uni_color");
    gl.uniform4fv(colorLocation, color);
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}


function points_fun(){
    var g_s_p = document.getElementById("slider_p").value;
    currentPoints = g_s_p;
}

function size_fun(){
    var get_size = document.getElementById("size").value;
    
    canvas.width= get_size;
    canvas.height = get_size;
}


function Speed_fun(){
    get_ss = document.getElementById("ss").value;
}


function animate() {
    changeColor()
    points_fun()
    updatePoints();
    gl.viewport( 0, 0, canvas.width, canvas.height );
    var get_size = document.getElementById("size").value;
    canvas.width= get_size;
    canvas.height = get_size;
     gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    render();
  }
  


var intervalId = null;
var startButton = document.getElementById("start-button");
 startButton.addEventListener("click",() => {
     get_ss = document.getElementById("ss").value;
    delay = get_ss;
    console.log(delay);
    intervalId = setInterval(animate, delay);
    status_text.value = 'Generated'
 })

var stopButton = document.getElementById("stop-button");
 stopButton.addEventListener("click",() => {
 clearInterval(intervalId);
 status_text.value = ' Stopped Generation'
 })

 };

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
}

function changeColor() {
    var colorInput = document.getElementById('color');
    var color_hex_input = document.getElementById('color_hex');
    var k = colorInput.value;
    color_hex_input.value = colorInput.value;
    colorInput.addEventListener('input', () => {
        var color = colorInput.value;
        color_hex_input.value = color;
    })
    var r_value = parseInt(k.slice(1, 3), 16)/255;
    var g_value = parseInt(k.slice(3, 5), 16)/255;
    var b_value = parseInt(k.slice(5, 7), 16)/255;
    color = [r_value, g_value, b_value,1];

}


