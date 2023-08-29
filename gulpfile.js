//Aqui es donde se comunica gulp
//funcion = tarea en gulp
//npx ejecuta paquetes sin la necesidad de instalarlos globalmente
//Los binarios .bin son las instrucciones o reglas que hace que se entienda algun herramienta (EJ. SASS, gulp)
//npm run nombre de la tarea 
//npx gulp nombre de la tarea 

const { src, dest, watch, parallel} = require("gulp"); //Importamos gulp y en las llaves extraemos algunas de sus funciones para ocuparlas 
//src identifica un archivo 
//dest guarda el archivo 

//CSS
const sass = require("gulp-sass")(require('sass')); //Importar sass
const plumber = require("gulp-plumber"); // Captura los errores y permite que la ejecución del flujo de trabajo continúe.
const autoprefixer = require('autoprefixer'); //Da soporte en los navegadores para ejecutar lo ultimo de css
const cssnano = require('cssnano'); //Comprime nuestro codigo de css
const postcss = require('gulp-postcss');//Hace transformaciones apoyandose de autoprefixer, cssnano, etc.
const sourcemaps = require('gulp-sourcemaps');


//IMAGENES
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');  //Importamos webp
const avif = require("gulp-avif");

//JAVASCRIPT
const terser = require('gulp-terser-js'); //Comprime nuestro codigo de JavaScript

function css(done){
    
    src("src/scss/**/*.scss")    //Identificar todos los archivos con la extension .scss 
        .pipe(sourcemaps.init())//Inicializa el sourcemaps con la hoja de estilo que tiene que compilar 
        .pipe(plumber()) //Marca el error pero no detiene la ejecucion 
        .pipe(sass()) //Compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))//Minifica el codigo css
        .pipe(sourcemaps.write('.')) //Ubicacion donde se va a guardar el .map. El '.' indica que se guarde en la misma ubicacion que la original
        .pipe(dest("build/css"))  //Almacenar en el disco duro

    done();//Callback que avisa a gulp cuando llegamos al final de la ejecucion de la funcion z
}

function imagenes(done){

    const opciones = {
        optimizationLevel: 3 //Mejora las iamgenes en nivle de optimizacion de 3
    }

    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones))) //Reduce el peso de las imagenes sin convertirlas a .webp
        .pipe(dest('build/img'))
        
    done();
}

function convertirWebp(done){

    const opciones = {
        quality: 50 //Establecemos una calidad para las imagenes 
    };

    src('src/img/**/*.{png,jpg}') //Cuando se buscan 2 o mas formatos estos se colocan entre llaves
        .pipe(webp(opciones)) //Conversion de imagnes a .webp
        .pipe(dest('build/img'))

    done();
}

function convertirAvif(done){

    const opciones = {
        quality: 50 //Establecemos una calidad para las imagenes 
    };

    src('src/img/**/*.{png,jpg}') //Cuando se buscan 2 o mas formatos estos se colocan entre llaves
        .pipe(avif(opciones)) //Conversion de imagnes a avif
        .pipe(dest('build/img'))

    done();
}

function javascript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())//Minifica el codigo de JavaScript
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'))

    done();
}

function dev(done){
    watch("src/scss/**/*.scss", css) //Ver los cambios de todos los archivos con la extension .scss 
    // , css es la tarea que se ejecuta al ver los cambios de los archivos 
    watch("src/js/**/*.js", javascript)
    done();
}
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.convertirWebp = convertirWebp;
exports.convertirAvif = convertirAvif;
exports.dev = parallel(imagenes, convertirWebp, convertirAvif, javascript, dev); //parallel ejecuta tareas al mismo tiempo
// serial ejecuta tareas una despues de otra 
