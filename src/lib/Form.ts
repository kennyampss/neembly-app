// npm dependencies
// @ts-ignore
import FormBase from "vform";

export default class Form extends FormBase {
  [x: string]: any;
  busy: boolean = false;

  constructor(data: any = {}) {
    super(data);

    Object.assign(this, data);
  }

  post(...args: any[]) {
    return super.post(...args);
  }

  patch(...args: any[]) {
    return super.patch(...args);
  }

  fill(...args: any[]) {
    return super.fill(...args);
  }

  reset() {
    return super.reset();
  }
}
