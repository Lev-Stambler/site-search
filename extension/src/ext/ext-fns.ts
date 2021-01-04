import type { IStorage } from "../types";

type CallbackStorage = (storage: IStorage) => any
type CallbackGen = (v: any)=> any
type CallbackEmpty = ()=> any

export interface ExtFns {
  StorageGet(keys: string[] | null): Promise<any>
  StorageSet (val: IStorage): Promise<any>,
  ExecScript(tabId: number, opts: any, cbk: CallbackGen): void
  TabQuery(opts, cbk: CallbackGen): void
}