import format from "date-fns/format";

const log = msg => console.log(`[${format(Date.now())}]`, msg);

export default log;
