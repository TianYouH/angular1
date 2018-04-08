angular.module("Valid",[])

.directive("equalTo", function () {
    return {
        require: "ngModel",
        link: function (scope, ele, attrs, ctrl) {

            console.log(scope);//打印当前作用域
            console.log(attrs);//打印当前标签属性列表
            console.log(ctrl);//打印当前ctrl

            var target = attrs["equalTo"];//获取自定义指令属性键值

            if (target) {//判断键是否存在
                scope.$watch(target, function () {//存在启动监听其值
                    ctrl.$validate()//每次改变手动调用验证
                }) 

                // 获取当前模型控制器的父控制器FormController
                var targetCtrl = ctrl.$$parentForm[target];//获取指定模型控制器
                console.log(targetCtrl)

                ctrl.$validators.equalTo = function (modelValue, viewVale) {//自定义验证器内容
                    
                    var targetValue = targetCtrl.$viewValue;//获取password的输入值

                    return targetValue == viewVale;//是否等于passwordConfirm的值
                }

                ctrl.$formatters.push(function (value) {
                    console.log("正在进行数据格式化的值:",value)
                    return value;
                })

                ctrl.$parsers.push(function (value) {
                    console.log("正在进行数据转换的值:",value)
                    return value;
                })
            }
        }
    }
})