
class ThemeManager {
    themesMapping;

    theme;

    bgcColor;
    axisColor;
    convergePointColor;
    unconvergeFastPointColor;
    unconvergePointColor;
    undefPointColor;

    //settingsBarColor;
    //settingsBarLabelTextColor;
    //settingsBarInputTextColor;

    constructor(theme = "light-brown") {
        this.themesMapping = new Map([
            ["Light brown", "light-brown"],
            ["Yellow blue", "yellow-blue"],
            ["Black-White", "black-white"],
            ["Progressive", "black-white-progressive"],
            ["Harmonic", "special-harmonic"],
        ])
        this.setTheme(theme);
    }


    /*
    строковое задание цветов:
    "#d0d0d0"
    "rgb(208,208,208)"
    "#d0d0d0ff"
    "rgba(208,208,208,255)" - последнее это непрозрачность
     */
    setTheme(theme = "light-brown"){
        switch (theme) {
            case "light-brown": default:
                this.theme = theme;
                this.bgcColor = "#ecedea";
                this.axisColor = "#202020";
                this.convergePointColor = "#8c7247";
                this.unconvergeFastPointColor = "#d0d0d0";
                //this.unconvergePointColor = "#c9b881";
                //this.unconvergePointColor = "#d0be85";
                //this.unconvergePointColor = "#f1da8e";
                this.unconvergePointColor = "#ddc36f";
                this.undefPointColor = "#d0d0d0";
                break;
            case "yellow-blue":
                this.theme = theme;
                this.bgcColor = "#000000";
                this.axisColor = "#d0d0d0";
                this.convergePointColor = "#4dbbd6";
                this.unconvergeFastPointColor = "#cec965";
                this.unconvergePointColor = "#ec1c24";
                this.undefPointColor = "#d0d0d0";
                break;
            case "black-white-progressive": case "black-white":
                this.theme = theme;
                this.bgcColor = "#000000";
                this.axisColor = "#d0d0d0";
                this.convergePointColor = "#ffffff";
                this.unconvergeFastPointColor = "#000000";
                this.unconvergePointColor = "#ffffff";
                this.undefPointColor = "#d0d0d0";
                break;
            case "special-harmonic":
                this.theme = theme;
                this.bgcColor = "#000000";
                this.axisColor = "#d0d0d0";
                this.convergePointColor = "#ffffff";
                //this.unconvergeFastPointColor = "#000000";
                //this.unconvergePointColor = "#ffffff";
                this.undefPointColor = "#d0d0d0";
                break;
        }
        //console.log()
    }


    getUnconvergePointColor(progress){
        switch (this.theme) {
            case "light-brown": case "yellow-blue": default:
                return this.fade(this.unconvergeFastPointColor, this.unconvergePointColor, progress, 2);
            case "black-white-progressive":
                return this.fade(this.unconvergeFastPointColor, this.unconvergePointColor, progress, 1);
            case "black-white":
                return this.fade(this.unconvergeFastPointColor, this.unconvergePointColor, progress, 0);
            case "special-harmonic":
                return this.specialHarmonicFade(progress);
        }
    }

    fade(sColor, eColor, progress, interpolationType){
        let interpolation;
        switch (interpolationType){
            case 0: interpolation = (s,e,p)=>this.noInterpolation(s,e,p); break;
            case 1: interpolation = (s,e,p)=>this.linearInterpolation(s,e,p); break;
            case 2: interpolation = (s,e,p)=>this.harmonicInterpolation(s,e,p); break;
            //case 3: interpolation = (c,u,p)=>this.specialHarmonicInterpolation(c,u,p); break;
            case 4: interpolation = (c,u,p)=>this.hyperbolicInterpolation(c,u,p); break;
        }
        let pr = progress, pg = progress, pb = progress;
        let sr = parseInt(sColor.substring(1,3), 16);
        let sg = parseInt(sColor.substring(3,5), 16);
        let sb = parseInt(sColor.substring(5,7), 16);
        let er = parseInt(eColor.substring(1,3), 16);
        let eg = parseInt(eColor.substring(3,5), 16);
        let eb = parseInt(eColor.substring(5,7), 16);
        if (sr>er) {const t = er; er = sr; sr = t; pr = 1-pr;}
        if (sg>eg) {const t = eg; eg = sg; sg = t; pg = 1-pg;}
        if (sb>eb) {const t = eb; eb = sb; sb = t; pb = 1-pb;}
        let rr = interpolation(sr, er, pr);
        let rg = interpolation(sg, eg, pg);
        let rb = interpolation(sb, eb, pb);
        return this.rgbToHex(rr,rg,rb);
        //return "#" + this.toHexInColor(rr) + this.toHexInColor(rg) + this.toHexInColor(rb);
    }
    noInterpolation(sc, ec, pr){
        return pr<1 ? sc : ec;
    }
    linearInterpolation(sc, ec, pr) {
        let rc = sc + (ec-sc)*pr;
        rc = rc<0 ? 0 : rc>255 ? 255 : rc;
        return rc;
    }
    harmonicInterpolation(sc, ec, pr) {
        //let rc = sc + (ec-sc)*Math.cos(-Math.PI/2 + pr*Math.PI/2);
        let rc = sc + (ec-sc)*Math.sin(pr*Math.PI/2);
        //rc = rc<0 ? 0 : rc>255 ? 255 : rc;
        return rc;
    }
    hyperbolicInterpolation(sc, ec, pr) {
        //let rc = sc + (ec-sc)*Math.cos(-Math.PI/2 + pr*Math.PI/2);
        let rc = sc + (ec-sc)*Math.tanh(2*pr);
        //rc = rc<0 ? 0 : rc>255 ? 255 : rc;
        return rc;
    }
    specialHarmonicFade(pr) {
        const r = 0.1, g = 0.11, b = 0.08;
        let rr = 128 + 127 * Math.cos(pr*256*r);
        let rg = 128 + 127 * Math.sin(pr*256*g);
        let rb = 128 + 127 * Math.cos(pr*256*b);
        return this.rgbToHex(rr,rg,rb);
    }
    /*toHexInColor(integer) {
        const str = Number(Math.round(integer)).toString(16);
        return str.length === 1 ? "0" + str : str;
    }*/
    rgbToHex(r,g,b){
        return "#" + ("00000" + (Math.round(r)<<16|Math.round(g)<<8|Math.round(b)).toString(16)).slice(-6);
    }
}