import {store} from "../../store"
import { deleteAllStructs } from "../totalStructsSlice";

beforeEach(async () => {
    const arrays = store.getState().totalStructs;
    let result = await store.dispatch(deleteAllStructs);
})