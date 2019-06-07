var app = angular.module('salas', ['ngTable']);

app.controller('mainController', function ($scope, $http) {

    var host = 'http://10.1.2.32:9098';

    $scope.names = [
        "Alexsandra Marques",
        "Anny Navarro",
        "Awdren Venancio",
        "Eduardo Cordeiro",
        "Eduardo Rodrigues",
        "Fernanda Szumski",
        "Hector Nagao",
        "Jean Mello",
        "Jessica Machado",
        "Jessica Zambianco",
        "Joao Pucci",
        "Lucas Rosa",
        "Nilton Amaral",
        "Paulo Ribas",
        "Renan Rosa",
        "Vinicius Santos"
    ];

    $scope.info = function (sala) {
        iziToast.info({
            title: '',
            message: 'Descrição: ' + sala.descricao,
            position: 'center',
            overlay: true
        });
    }

    $scope.excluir = function (sala) {
        iziToast.show({
            theme: 'dark',
            icon: 'icon-person',
            title: 'Atenção:',
            timeout: 1000000,
            message: 'A EXCLUSÃO não pode ser desfeita!',
            position: 'center',
            buttons: [
                ['<button>Prosseguir</button>', function (instance, toast) {

                    $http({
                        method: 'GET',
                        url: host + '/excluir',
                        params: { folder: sala.folder }
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        iziToast.destroy();
                        iziToast.success({
                            title: 'Feito!',
                            message: 'Container excluido',
                            position: 'center'
                        });
                        $scope.carregarHistorico();

                    },
                        function errorCallback(response) {
                            console.error(response.data)
                        });
                }, true],
                ['<button>Cancelar</button>', function (instance, toast) {
                    instance.hide({
                        transitionOut: 'fadeOutUp',
                        onClosing: function (instance, toast, closedBy) {
                            console.info('closedBy: ' + closedBy);
                        }
                    }, toast, 'buttonName');
                }]
            ]
        });
    }

    $scope.pull = function (sala) {
        iziToast.show({
            theme: 'dark',
            icon: 'icon-person',
            title: 'Atenção:',
            timeout: 1000000,
            message: 'A operação não pode ser desfeita!',
            position: 'center',
            buttons: [
                ['<button>Prosseguir</button>', function (instance, toast) {
                    iziToast.destroy();
                    iziToast.info({
                        title: 'Aguarde',
                        message: 'Realizando pull',
                        position: 'center',
                        overlay: true,
                        close: false,
                        closeOnEscape: false,
                        closeOnClick: false,
                        timeout: 1000000
                    });
                    $http({
                        method: 'GET',
                        url: host + '/pull',
                        params: { folder: sala.folder }
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        iziToast.destroy();
                        iziToast.success({
                            title: 'Feito!',
                            message: 'Git pull realizado',
                            position: 'center'
                        });

                    },
                        function errorCallback(response) {
                            console.error(response.data)
                        });
                }, true],
                ['<button>Cancelar</button>', function (instance, toast) {
                    instance.hide({
                        transitionOut: 'fadeOutUp',
                        onClosing: function (instance, toast, closedBy) {
                            console.info('closedBy: ' + closedBy);
                        }
                    }, toast, 'buttonName');
                }]
            ]
        });
    }

    $scope.carregarHistorico = function () {

        $http({
            method: 'GET',
            url: host + '/carregarhistorico'
        }).then(function successCallback(response) {
            $scope.historico = response.data;
            console.log(response.data);
        },
            function errorCallback(response) {
                console.error(response.data)
            });
    }

    $scope.criarSala = function () {

        iziToast.info({
            title: 'Aguarde',
            message: 'Criando sala',
            position: 'center',
            overlay: true,
            close: false,
            closeOnEscape: false,
            closeOnClick: false,
            timeout: 1000000
        });

        $scope.sala.projeto = 'https://github.com/lojasmm/MMWeb.git';
        $scope.sala.autor = $scope.autor.replace(" ", "-");

        $http({
            method: 'GET',
            url: host + '/criarsala',
            params: { projeto: $scope.sala.projeto, branch: $scope.sala.branch, os: $scope.sala.os, descricao: $scope.sala.descricao, autor: $scope.sala.autor }
        }).then(function successCallback(response) {
            console.log(response);
            $scope.sala = {};
            iziToast.destroy();
            iziToast.success({
                title: 'Sucesso',
                message: 'Sala criada, para acessá-la use: <a href="' + response.data + '" target="Salas"> ' + response.data + '</a>',
                position: 'center',
                overlay: true,
                close: true,
                timeout: 1000000
            });
        },
            function errorCallback(response) {
                iziToast.destroy();
                iziToast.error({
                    title: 'Erro',
                    message: 'Problemas ao criar a sala',
                    position: 'center',
                    overlay: true,
                    close: false,
                    timeout: 1000000,
                    closeOnClick: true
                });
                console.error(response.data)
            });
    }

});