export interface IDataDropdown<TValue = string, TLabel = string, TKeyword = string> {
  value: TValue;
  label: TLabel;
  keyword?: TKeyword;
}
