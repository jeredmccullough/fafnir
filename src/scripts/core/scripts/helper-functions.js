export const deserialize = val => {
  try {
    return JSON.parse(val);
  } catch (e) {
    return {error: val, _error: e};
  }
};

export const generateID = () => Math.round(Math.random() * 10000000000000000);
const scrollElms = {};

export const scrollTo = ({speed = 300, position = 0, element = window, direction = 'top'}) => {
  _.each(scrollElms[element.className], function(intv) {
    clearInterval(intv);
  });
  scrollElms[element.className] = [];
  const originalPos = element.getBoundingClientRect()[direction];
  const offset = Math.abs(originalPos - parseInt(element.style[direction]));
  return new Promise(res => {
    if (Math.abs(position - originalPos) > 1) {
      const initial = originalPos;
      const intervalSize = Math.abs(position - initial) / speed;
      scrollElms[element.className].push(window.setInterval(() => {
        const newPos = element.getBoundingClientRect()[direction];
        if (Math.abs(_.floor(position - newPos)) <= 1) {
          element.style[direction] = `${position}px`;
          clearInterval(scrollElms[element.className]);
          res();
        }
        let newPosition = newPos;
        position > initial && (newPosition = newPosition + intervalSize);
        position < initial && (newPosition = newPosition - intervalSize);
        element.style[direction] = `${newPosition - offset}px`;
        return;
      }, 1));
    } else {
      res();
    }
  });
};
