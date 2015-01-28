String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};


var Utils = function(){};

Utils.prototype.getGravatarImageUrl = function(email){
    var MD5 = new Hashes.MD5();

    return "http://www.gravatar.com/avatar/{md5}".supplant({md5:MD5.hex(email)});
};
