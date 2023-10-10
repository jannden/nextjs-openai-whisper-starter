export function cleanInput(s: string) {
  if (typeof s === "undefined") return "";
  if (s === null) return "";
  return s.trim();
}

export function getStringFromFormData(formData: FormData, key: string, defaultValue: string = "") {
  const value = formData.get(key);
  if (typeof value === "string") return cleanInput(value);
  return defaultValue;
}

export function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}