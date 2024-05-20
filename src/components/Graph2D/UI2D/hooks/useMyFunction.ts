import { TF } from "../../Graph2D";

const useMyFunction = (): [(str: string) => TF, (f: TF) => string] => {

    const getFunction = (str: string): TF => {
        let f = () => 0;
        try {
            eval(`f = function(x) {return ${str};}`);
            return f;
        } catch (e) {
            //console.log('ошибка ввода', e);
            return f;
        }
    }

    // function(x) {return x*x;}
    // function(x){returnx*x;}
    // ['function(x){', 'x*x;}']
    // x*x;}
    // ['x*x', '}']
    // x*x
    const getFunctionBody = (f: TF): string => {
        return f.toString().replaceAll(' ', '').split('return')[1].split(';')[0];
    }

    return [getFunction, getFunctionBody];
}

export default useMyFunction;