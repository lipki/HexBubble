function gettext () {
    
    if( !this.lang ) {
        if ( navigator.language ) this.lang = navigator.language;
        else if ( navigator.userLanguage ) this.lang = navigator.userLanguage;
    } else this.lang = "?";

}

var gt = new gettext();

function _ ( text ) {
    
    rep = text;
    
    if( index = gettextString[gt.lang].ref.indexOf(text) != -1 ) {
        rep = gettextString[gt.lang].trad[index];
    }
    
    if( arguments.length > 1 ) {
        trep = [];
        rep.split('%s');
        for( var i=1; i<arguments.length; i++ ) {
            trep.push(rep[i-1]);
            trep.push(arguments[i]);
        }
        trep.push(rep[i]);
        trep.joint('');
    }
    
    return rep;

}
