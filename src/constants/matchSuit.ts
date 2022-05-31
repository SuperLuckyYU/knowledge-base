export const SUIT_STATUS_OPTIONS = [
  {
    label: '搭配池',
    value: '0'
  },
  {
    label: '未上架',
    value: '1'
  },
  {
    label: '已上架',
    value: '2'
  },
  {
    label: '已下架',
    value: '3'
  },
]

export const suitStatusFilter = (value:string) => {
  return SUIT_STATUS_OPTIONS.find((item) => item.value === value)?.label
}
