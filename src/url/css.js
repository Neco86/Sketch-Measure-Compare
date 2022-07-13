import css from './index.css';

export default URL.createObjectURL(new Blob([css], { type: 'text/css' }));
