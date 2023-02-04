Usage (for the moment):

```typescript
import { NavDataProviderFactory, ProcedureProviderFactory } from  "./Factories";

const  navData = NavDataProviderFactory.createFromXP12({
    waypointFile:  "/your/path/to/xplane12_native_2301/earth_fix.dat",
    navaidFile:  "/your/path/to/xplane12_native_2301/earth_nav.dat"
});

const  procedures = ProcedureProviderFactory.createFromXP12(
    "/your/path/to/xplane12_native_2301/CIFP/LCPH.dat"
);

const  proc = procedures.getSid("NORD1C", navData);
console.log(proc1.toString());
console.log(JSON.stringify(proc1.toPath().toCesiumArray()));
```
