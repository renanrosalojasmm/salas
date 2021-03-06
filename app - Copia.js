var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var logger = require('morgan');
const helmet = require('helmet');
var compression = require('compression');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })
const log = require('simple-node-logger').createSimpleLogger('logs/commands.log');
var PropertiesReader = require('properties-reader');

app.use(express.static('bower_components'));
app.use(express.static('node_modules'));
app.use(express.static('js'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression());
app.use(logger('combined', { stream: accessLogStream }));
app.use(helmet());
var porta = 9098;
const request = require('request');

var Datastore = require('nedb')
    , db = new Datastore({ filename: 'data/database.db', autoload: true });

function execCommand(comando, base) {

    const exec = require("child_process").execSync;
    console.log(comando);

    if (base == '') {
        exec(comando, (error, stdout, stderr) => {
            if (stderr) log.error(stderr);
            log.error(error);
            log.info(stdout);
            log.error(stderr);
            res.send(sdtout);
        })
    }
    else{
        exec(comando, { cwd: base }, (error, stdout, stderr) => {
            if (stderr) log.error(stderr);
            log.error(error);
            log.info(stdout);
            log.error(stderr);
            res.send(sdtout);
        })
    }
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/excluir', function (req, res) {

    var comando = 'rm -f -d -r ' + req.query.folder;
    execCommand(comando, '');

    req.query.folder = req.query.folder.replace('projetos/', '');
    comando = 'docker rm -f ' + req.query.folder;
    execCommand(comando);

    db.remove({ folder: 'projetos/' + req.query.folder }, {}, function (err, numRemoved) {
    });
    console.log(req.query.folder + ' excluido');
    res.send(true);
});


app.get('/pull', function (req, res) {

    var comando = 'git reset --hard';
    execCommand(comando, req.query.folder);
    comando = 'git pull';
    execCommand(comando, req.query.folder);
    res.send(true);
});

app.get('/criarsala', function (req, res) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var host = 'http://10.102.0.32';
    var port = Math.floor((Math.random() * 10000) + 41050);
    req.query.autor = req.query.autor.replace(/[^a-zA-Z]/g, "");

    var name = `${req.query.autor}-${req.query.os}-${dd}-${mm}-${yyyy}`;
    var folder = 'projetos/' + `${req.query.autor}-${req.query.os}-${dd}-${mm}-${yyyy}`;
    const exec = require("child_process").execSync;

    var comando = 'rm -f -r -d ' + folder;
    log.info(comando);
    exec(comando, (error, stdout, stderr) => {
        if (stderr) log.error(stderr);
        log.error(error);
        log.info(stdout);
        log.error(stderr);
        res.send(sdtout);
    })

    request(`http://10.102.0.32:3000/decrypt?palavra=faf6a30f70daabc6d657`, { json: true }, (err, response, body) => {

        if (err) { return console.log(err); }

        var comando = '';
        console.log(req.query.projeto);

        if (req.query.projeto.includes("MMWeb")) {
            comando = `git pull`;
            log.info(comando);
            exec(comando, { cwd: 'projetos/MMWEB_MASTER' }, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `cp -R -n projetos/MMWEB_MASTER ${folder}`;
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `git pull`;
            log.info(comando);
            exec(comando, { cwd: folder }, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `git checkout ${req.query.branch}`;
            log.info(comando);
            exec(comando, { cwd: folder }, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `git pull`;
            log.info(comando);
            exec(comando, { cwd: folder }, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `rm -d -f -r /Public`;
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            }) 

            comando = `cp -R -n /Public_MMWeb /Public`;
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `cp -R -n /Public /servicos/Salas/${folder}/`;
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            }) 

            comando = `docker run --name ${name} -p ${port}:80 -d -v /servicos/Salas/${folder}:/www renanrosa/webvendas`
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.info(stderr);
                log.info(error);
                log.info(stdout);
                log.info(stderr);
                res.send(sdtout);
            })

            comando = `docker exec ${name} /opt/lampp/lampp restart`
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.info(stderr);
                log.info(error);
                log.info(stdout);
                log.info(stderr);
                res.send(sdtout);
            })

            req.query.host = host + ':' + port;
            req.query.folder = folder;
            db.insert(req.query, function (err, newDoc) {
            });

            log.info('Sala criada com sucesso');
            res.send(`${host}:${port}`);
        }
        if (req.query.projeto.includes("Extranet")) {
            comando = `git pull`;
            log.info(comando);
            exec(comando, { cwd: 'projetos/EXTRANET_MASTER' }, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `cp -R -n projetos/EXTRANET_MASTER ${folder}`;
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `git pull`;
            log.info(comando);
            exec(comando, { cwd: folder }, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `git checkout ${req.query.branch}`;
            log.info(comando);
            exec(comando, { cwd: folder }, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `git pull`;
            log.info(comando);
            exec(comando, { cwd: folder }, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `rm -d -f -r /Public`;
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            }) 

            comando = `cp -R -n /Public_Extranet /Public`;
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `cp -R -n /Public /servicos/Salas/${folder}/`;
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            }) 

            comando = `docker run --name ${name} -p ${port}:80 -d -v /servicos/Salas/${folder}:/srv/www/default/intranova/intranetPiloto1/ renanrosa/extranet`
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.info(stderr);
                log.info(error);
                log.info(stdout);
                log.info(stderr);
                res.send(sdtout);
            })

            comando = `docker exec ${name} /opt/lampp/lampp restart`
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.info(stderr);
                log.info(error);
                log.info(stdout);
                log.info(stderr);
                res.send(sdtout);
            })

            req.query.host = host + ':' + port;
            req.query.folder = folder;
            db.insert(req.query, function (err, newDoc) {
            });

            log.info('Sala criada com sucesso');
            res.send(`${host}:${port}`);
        }
        /*else{
           
            var projeto = req.query.projeto.replace('//', `//renanrosalojasmm:${response.body}@`);

            comando = `git clone -b ${req.query.branch} ${projeto} ${folder}`;
            log.info(comando);
            exec(comando, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            comando = `npm install`;
            log.info(comando);
            exec(comando, { cwd: folder }, (error, stdout, stderr) => {
                if (stderr) log.error(stderr);
                log.error(error);
                log.info(stdout);
                log.error(stderr);
                res.send(sdtout);
            })

            // docker run -d -it --rm --name TESTESNODE -p 19000:18000 -v /servicos/Foccus:/usr/src/app -w /usr/src/app node:8 node
            var properties = PropertiesReader(`/servicos/Salas/${folder}/.properties`);
            var portServer = properties.get(`application.port`);


            fs.writeFile(`.dockerfile', 'FROM node:10\nEXPOSE ${portServer}`, function (err) {
                if (err) throw err;


              }); 

            comando = `docker run -d --name ${name} -p ${port}:${portServer} -v /servicos/Salas/${folder}:/usr/src/app -w /usr/src/app node:8 node server.js`
            log.info(comando);
            
            spawn('docker', [comando], {
                stdio: 'ignore', // piping all stdio to /dev/null
                detached: true
            }).unref();
            
        }*/
    });
});

app.get('/carregarhistorico', function (req, res) {
    db.find({}, function (err, docs) {
        res.send(docs);
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(porta);
console.log(`Servidor escutando na porta ${porta}`);
//}


