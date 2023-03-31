export class ZipCodeService{
  url = 'http://api.zippopotam.us/'
  code = 'US'
  cacheData = new Map()
  static instance;
  static getInstance() {
    if(!ZipCodeService.instance) {
      ZipCodeService.instance = new ZipCodeService()
    }
    return ZipCodeService.instance
  }
  async fetchData(zipCode) {
      return await fetch(`${this.url}${this.code}/${zipCode}`).then((res) => res.json()).then(res => {
        console.log(res)
        return res.places?.[0]?.['place name']
      })
  }
  async getCode(zipCode) {
    if(!this.cacheData.has(zipCode)){
      this.cacheData.set(zipCode, await this.fetchData(zipCode))
    } 
    return this.cacheData.get(zipCode)
  }
}