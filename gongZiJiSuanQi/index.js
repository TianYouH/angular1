angular.module('GZ', ["ngStorage"])
    .controller('CalcController', ['$scope', "CalcService", "SettingSerivce", function ($scope, calcService, settingSerivce) {

        $scope.calc = function () {
            var jiben = $scope.jiben || 0
            var jixiao = $scope.jixiao || 0
            var jiangjin = $scope.jiangjin || 0

            $scope.result = calcService.doCalc(jiben, jixiao, jiangjin)
            $scope.showResult = true
        }

        $scope.settings = settingSerivce;

        // $scope.$watchCollection("settings.shebao", function (newValue, oldValue) {
        //     if ($scope.showResult) {
        //         $scope.calc();                   //监视机制
        //     }
        // })

        $scope.$on("SettingChange", function () {
            if ($scope.showResult) {
                $scope.calc();                   //监视广播
            }
        })

    }])

    .controller("SettingController", ["$scope", "$rootScope", "SettingSerivce", function ($scope, $rootScope, settingSerivce) {
        $scope.shebao = settingSerivce.shebao;

        $scope.rootBroadcastChange = function () {
            // $scope.$root   //创建一个广播
            $rootScope.$broadcast("SettingChange")
        }
    }])
    .service("SettingSerivce", ["$localStorage", function (storage) {
        this.shebao = storage.$default({
            yanglao: 0.08,
            yiliao: 0.02,
            shiye: 0.005,
            gongshang: 0,
            shengyu: 0,
            gongjijin: 0.08,
            tongchou: 20,
        })
    }])
    // service() 在模块中创建一个服务，服务是angular中共享的对象，可以包含共享的数据和方法。
    // 在angular应用中，如果有共享的数据和方法，则应该放入服务中，不要写在controller中，也不要单独创建一个对象
    // 因为在angular中，所有的代码全部都要放在模块中

    // service() 第一个参数是服务的名称，第二个参数是服务的构造函数(以数组加依赖项的方式定义);
    .service("CalcService", ["SettingSerivce", function (settingSerivce) {
        this.doCalc = function (jiben, jixiao, jiangjin) {
            // 总额
            var total = jiben + jixiao + jiangjin
            // 计税工资（扣除社保后的工资）
            var jishui = total - jiben * (settingSerivce.shebao.yanglao + settingSerivce.shebao.yiliao + settingSerivce.shebao.shiye + settingSerivce.shebao.gongjijin) - settingSerivce.shebao.tongchou

            // 计税基数
            var jishu = jishui > 3500 ? jishui - 3500 : 0;
            var shui = 0;

            // 计算个人所得税
            if (jishu <= 0) { shui = 0 }
            if (jishu <= 1500) { shui = jishu * 0.03 }
            else if (jishu <= 4500) { shui = jishu * 0.1 - 105 }
            else if (jishu <= 9000) { shui = jishu * 0.2 - 555 }
            else if (jishu <= 35000) { shui = jishu * 0.25 - 1005 }
            else if (jishu <= 55000) { shui = jishu * 0.3 - 2755 }
            else if (jishu <= 80000) { shui = jishu * 0.35 - 5505 }
            else { shui = jishu * 0.45 - 13505 }

            var shifa = jishui - shui

            return {
                total: total,
                shebao: {
                    yanglao: jiben * settingSerivce.shebao.yanglao,
                    yiliao: jiben * settingSerivce.shebao.yiliao,
                    shiye: jiben * settingSerivce.shebao.shiye,
                    gongshang: jiben * settingSerivce.shebao.gongshang,
                    shengyu: jiben * settingSerivce.shebao.shengyu,
                    gongjijin: jiben * settingSerivce.shebao.gongjijin,
                    tongchou: settingSerivce.shebao.tongchou,
                },
                jishui: jishui,
                jishu: jishu,
                shui: shui,
                shifa: shifa
            }
        }
    }])
    .filter("percent", function () {
        return function (input, fixed) {
            return (input * 100).toFixed(fixed) + "%";
        }
    })