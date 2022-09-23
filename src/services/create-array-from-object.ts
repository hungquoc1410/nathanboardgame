export const createArrayFromObject = (object: object) => {
  if (object) {
    return Object.keys(object).map((key) => object[key as keyof object])
  }
  return []
}
