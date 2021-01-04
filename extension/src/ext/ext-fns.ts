import type { IStorage } from "../types";

type CallbackStorage = (storage: IStorage) => any
type CallbackGen = (v: any)=> any
type CallbackEmpty = ()=> any

export interface ExtFns {
  StorageSyncGet(defaultVal: IStorage, storage: CallbackStorage): void
  StorageSyncSet (val: IStorage, storage: CallbackEmpty): void
  ExecScript(tabId: number, opts: any, cbk: CallbackGen): void
  TabQuery(opts, cbk: CallbackGen): void
}