var app = angular.module('fileManager',['ngRoute'])

app.config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'list.html',
			controller : 'FileListCtrl'
		})
		.when('/download', {
			templateUrl: 'download.html',
			controller: 'DownloadCtrl'
		})
		.otherwise({
			redirectTo : '/'
		})

	$httpProvider.defaults.transformRequest = function(obj){
		var str = []
		for (var p in obj) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
		}
		return str.join('&')
	}
	$httpProvider.defaults.headers.post = {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
}])

app.controller('FileListCtrl', ['$http', '$scope', '$route', function($http, $scope, $route){
	$scope.fileList = []
	$http.post('/fileList', {
	}).then(function(res){
		res = res.data
		var list = [];

		for (var i = res.length - 1; i >= 0; i--) {
			var obj = {
				name : res[i],
				url : window.location.origin + '/' + res[i]
			}
			list.push(obj)
		}
		$scope.fileList = list;


	}, function(e){
		console.error(e);
	})

	$scope.delete = function(name) {
		var pass;
		if(pass = prompt('请输入密码')) {
			$http.post('/delete', {
				name: name,
				pass: pass
			}).then(function(data) {
				if(data.error) {
					alert('删除失败');
				} else {
					$route.reload();
				}
			})
		}
	}
}])

app.controller('DownloadCtrl', ['$http', '$scope', function($http, $scope) {
	$scope.search = function(name) {
		if(name) {
			$http.post('/search', {
				fileName: name
			}).then(function(res) {
				console.log(res);
			}, function(err) {
				console.error(err);
			})
		}
	}

	$scope.download = function(url) {
		if(url) {
			$http.post('/download', {
				url: url
			}).then(function(res) {
				console.log(res);
			}, function(err) {
				console.error(err);
			})
		}
	}
}])

app.filter('back', function(){
	return function(input,type) {
		if(type) {
			var temp = [];
			for (var i = input.length - 1; i >= 0; i--) {
				if(input[i].name.indexOf('.'+type)!=-1)
					temp.push(input[i])
			}
		} else {
			temp = input
		}
		return temp;
	}
})