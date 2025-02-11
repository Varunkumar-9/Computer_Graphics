"use strict";

var canvas;
var gl;

var numVertices  = 54;

var pointsArray = [];
var colorsArray = [];

var xc = -1;
var cflag = 0;

var vertices = [
		
	vec4(0, 0,30,1.0),
	vec4(0,10,30,1.0),
	vec4(16,10,30,1.0),
	vec4(16, 0,30,1.0),

	vec4(0, 0,54,1.0),
	vec4(0,10,54,1.0),
	vec4(16,10,54,1.0),
	vec4(16, 0,54,1.0),

	vec4(8,16,30,1.0),
	vec4(8,16,54,1.0)	
		
    ];
	
	
for (var i=0; i<10; i+=1){
	vertices[i][0] = vertices[i][0] / 100;
	vertices[i][1] = vertices[i][1] / 100;
	vertices[i][2] = vertices[i][2] / 100;
}	
	

var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  
        vec4( 1.0, 0.0, 0.0, 1.0 ),  
        vec4( 1.0, 1.0, 0.0, 1.0 ),  
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 ),
        vec4( 1.0, 0.0, 1.0, 1.0 ),  
        vec4( 0.0, 1.0, 1.0, 1.0 ),
        vec4( 1.0, 1.0, 1.0, 1.0 ),  
		
		vec4( 0.0, 1.0, 0.0, 1.0 ), 
        vec4( 0.0, 1.0, 0.0, 1.0 ), 
		
		
];




var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 0.01, 0.0);

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}

function tri(a, b, c) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
	
	quad(6,2,8,9);
	quad(1,5,9,8);
	
	tri(2,1,8);
	tri(5,6,9);
}


window.onload = function init() {
	window.alert("Please enter the coordinates within the range of (-64,64). If the coordinates is not in this range the house may be clipped out of the view.")
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );


    render();
}



eye = vec3(0.0,0.0,0.0);

var cv1 = vec3(-0.8,0.8,10.0);
var cv2 = vec3(-0.8,0.8,-10.0);

var nc1 = [cv2[0] - cv1[0], cv2[1] - cv1[1], cv2[2] - cv1[2]];

var dvc = 0.0;



var AnimateLine = function() {
	cv1 = [parseFloat(document.getElementById("lx1").value), parseFloat(document.getElementById("ly1").value), parseFloat(document.getElementById("lz1").value)];
	cv2 = [parseFloat(document.getElementById("lx2").value), parseFloat(document.getElementById("ly2").value), parseFloat(document.getElementById("lz2").value)];
	
	for (var i=0; i<2; i+=1){
		cv1[i] = cv1[i] / 100;
		cv2[i] = cv2[i] / 100;
	}
	cv1[2] = (cv1[2] / 100) * 10;
	cv2[2] = (cv2[2] / 100) * 10;
	
	nc1 = [cv2[0] - cv1[0], cv2[1] - cv1[1], cv2[2] - cv1[2]];
	dvc = 0;
}
	

var count=0;


var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		var flag = 1;
		
			eye[0] = cv1[0] + (dvc*nc1[0]);
			eye[1] = cv1[1] + (dvc*nc1[1]);
			eye[2] = cv1[2] + (dvc*nc1[2]);
			
			if(count <= 1)
				flag = 1;
			else if(count <= 2)
					flag = 0;
			if(count > 2)
			{
				count = 0;
				flag = 1;
			}
			count+=0.002;
			if(flag == 1)
				dvc+=0.002;
			if(flag == 0)
				dvc-=0.002;
				
        modelViewMatrix = lookAt(eye, at , up);
		projectionMatrix = perspective( 90, 1, 0.001, 512 );

        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

        gl.drawArrays( gl.TRIANGLES, 0, numVertices );
        requestAnimFrame(render);
    }
