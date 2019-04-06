module.exports.isAvailable = function (bookingArr, from, to) {
    let result = true;
    if(from >= to) {
        return false;
    } else {
       const len = bookingArr.length;
       for(let i=0;i<len;i++) {
        if(isGreater(from, bookingArr[i].from) && isGreater(bookingArr[i].to, from) === 1) {
            result = false;
            break;
        } else if(isGreater(bookingArr[i].from, from)  && isGreater(to, bookingArr[i].from) === 1) {
            result = false;
            break;
        }    
       }
       return result;
    }
};

function isGreater (first, second) {
    const firstArr = first.split(':');
    const secondArr = second.split(':');
    const firstHr = parseInt(firstArr[0]);
    const firstMn = parseInt(firstArr[1]);
    const secondHr = parseInt(secondArr[0]);
    const secondMn = parseInt(secondArr[1]);
    if(firstHr > secondHr) {
        return 1;
    } else if (secondHr > firstHr) {
        return 0;
    } else {
        if(firstMn > secondMn) {
            return 1;
        } else if(secondMn > firstMn) {
            return 0;
        } else {
            return 2;
        }
    }
}