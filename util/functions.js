export function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0
      }

      const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

      let comparison = 0
      if (varA > varB) {
      comparison = 1;
      } else if (varA < varB) {
      comparison = -1;
      }
      return (
      (order === 'desc') ? (comparison * -1) : comparison
      )
    }
}

export function randomProperty (obj) {
    var keys = Object.keys(obj)
    let key = keys[ keys.length * Math.random() << 0]
    return [obj[key], key]
}

export function shuffle(array) {
    var currentIndex = array.length
    var temporaryValue
    var randomIndex
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      //console.log(currentIndex)
      randomIndex = Math.floor(Math.random() * currentIndex);
      //console.log(randomIndex)
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      //console.log(array[currentIndex])
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array
}