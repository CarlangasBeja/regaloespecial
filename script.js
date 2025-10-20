// Mostrar nombre del usuario en saludo
const saludoDiv = document.getElementById("saludo");
const nombreUsuario = localStorage.getItem('nombre') || "amigo/a";
saludoDiv.textContent = `💌 Hola ${nombreUsuario}, te quiero decir algo 💌`;

// --- Frases y latido + colores + fuegos artificiales ---
const mensajeDiv = document.getElementById("mensaje");
const corazonImg = document.querySelector('.corazon-img');

const frasesHombre = [
    "Eres fuerte y valiente.","Cada día es una nueva oportunidad.","Tu esfuerzo vale oro.",
    "Sigue adelante, no te rindas.","Tu potencial es infinito.","Cree en ti mismo siempre.",
    "Los desafíos te hacen grande.","Nada es imposible para ti.","Tu actitud define tu camino.",
    "Cada paso te acerca a tu meta."
];
const frasesMujer = [
    "Eres increíble y valiosa.","Tu sonrisa ilumina el mundo.","Nunca subestimes tu fuerza.",
    "Cada día trae nuevas posibilidades.","Cree en ti y en tus sueños.","Tu energía es contagiosa.",
    "Eres capaz de lograr lo que quieras.","Confía en tu instinto.","Eres única y especial.",
    "El mundo necesita tu luz."
];

let fraseIndex = 0;

// --- Contenedor de fuegos artificiales ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('container').appendChild(renderer.domElement);

// Corazón de partículas
const heartParticles = 6000;
const heartGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(heartParticles*3);
const colors = new Float32Array(heartParticles*3);

for(let i=0;i<heartParticles;i++){
    const t=Math.random()*Math.PI*2;
    const u=Math.random()*Math.PI*2;
    const x=16*Math.pow(Math.sin(t),3);
    const y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    const z=Math.sin(u)*2;
    positions[i*3]=x; positions[i*3+1]=y; positions[i*3+2]=z;
    colors[i*3]=1; colors[i*3+1]=0; colors[i*3+2]=Math.random()*0.5;
}

heartGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
heartGeometry.setAttribute('color', new THREE.BufferAttribute(colors,3));

const heartMaterial = new THREE.PointsMaterial({
    size:0.5,
    vertexColors:true,
    transparent:true,
    blending:THREE.AdditiveBlending
});

const heart = new THREE.Points(heartGeometry, heartMaterial);
scene.add(heart);

// Fuegos artificiales
let fireworks = [];

function crearFuegosArtificiales(){
    const geometry = new THREE.BufferGeometry();
    const particulas = 100;
    const posiciones = new Float32Array(particulas*3);
    const colores = new Float32Array(particulas*3);
    for(let i=0;i<particulas;i++){
        posiciones[i*3]=0;
        posiciones[i*3+1]=0;
        posiciones[i*3+2]=0;
        const color = new THREE.Color(`hsl(${Math.random()*360}, 100%, 50%)`);
        colores[i*3]=color.r;
        colores[i*3+1]=color.g;
        colores[i*3+2]=color.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(posiciones,3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colores,3));
    const material = new THREE.PointsMaterial({size:0.5, vertexColors:true, blending:THREE.AdditiveBlending, transparent:true});
    const p = new THREE.Points(geometry, material);
    fireworks.push({points:p, velocities:[]});
    for(let i=0;i<particulas;i++){
        fireworks[fireworks.length-1].velocities.push({
            x:(Math.random()-0.5)*2,
            y:(Math.random()-0.5)*2,
            z:(Math.random()-0.5)*2
        });
    }
    scene.add(p);
}

// Animación
function animate(){
    requestAnimationFrame(animate);
    heart.rotation.y+=0.01;
    heart.rotation.x+=0.005;

    // animación de fuegos artificiales
    fireworks.forEach(f=>{
        const pos = f.points.geometry.attributes.position.array;
        f.velocities.forEach((v,i)=>{
            pos[i*3]+=v.x;
            pos[i*3+1]+=v.y;
            pos[i*3+2]+=v.z;
            // gravedad
            v.y-=0.01;
        });
        f.points.geometry.attributes.position.needsUpdate=true;
    });

    renderer.render(scene,camera);
}
animate();

// Resize
window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});

// Click en corazón
document.querySelector('.overlay').addEventListener('click',()=>{
    const genero=localStorage.getItem('genero')||"mujer";
    const frases=genero==="hombre"?frasesHombre:frasesMujer;

    if(fraseIndex<frases.length){
        // Frases con colores aleatorios
        mensajeDiv.textContent = frases[fraseIndex];
        mensajeDiv.style.color=`hsl(${Math.random()*360}, 100%, 70%)`;
        fraseIndex++;

        // Pulso del corazón
        corazonImg.style.transform="scale(1.7)";
        setTimeout(()=>{ corazonImg.style.transform="scale(1.2)"; },200);

        // Fuegos artificiales
        crearFuegosArtificiales();
    } else{
        mensajeDiv.textContent="💖 Vengan a mí todos ustedes, los agotados de tanto trabajar, que yo los haré descansar. Lleven mi yugo sobre ustedes, y aprendan de mí, que soy manso y humilde de corazón, y hallarán descanso para su alma; porque mi yugo es fácil, y mi carga es liviana.💖 Mateo 11:28-30 💖";
        document.querySelector('.overlay').style.pointerEvents="none";
    }
});
