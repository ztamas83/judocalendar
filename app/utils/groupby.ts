export function groupBy(data: any[], key: string): { [key: string]: any[] } {
  return data.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
