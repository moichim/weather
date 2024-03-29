import { ThermalGroup } from "../ThermalGroup";
import { ThermalRegistry } from "../ThermalRegistry";
import { ThermalFileRequest, ThermalRequest } from "../ThermalRequest";

export class ThermalRegistryLoader {

    public constructor(
        public readonly registry: ThermalRegistry
    ) {

    }


    /** Buffer of all pending requests */
    protected _requests: ThermalRequest[] = []
    public get requests() { return this._requests; }

    /** Loading state is stored in the registry */
    public get loading() { return this.registry.loading.value; }

    /** Request a single file. To fetch it, call ``resolveQuery` */
    public requestFile(
        group: ThermalGroup,
        thermalUrl: string,
        visibleUrl?: string
    ) {

        // Can request files only when the group is not loading
        if (this.loading === true) {
            console.error(`The registry ${this.registry.id} is already loading! Can not request  a single file!`);
            return;
        }

        // Add a single request
        this._requests.push(ThermalRequest.single(group, thermalUrl, visibleUrl));

    }

    /** Request multiple files. To fetch them, call ``resolveQuery` */
    public requestFiles(
        group: ThermalGroup,
        requests: ThermalFileRequest[]
    ) {

        // Can request files only when the group is not loading
        if (this.loading === true) {
            console.error(`The group ${this.registry.id} is already loading! Can not request multiple files!`);
            return;
        }

        // Add multiple requests
        this._requests = ThermalRequest.multiple(group, requests);

    }


    public async resolveQuery(): Promise<ThermalGroup[]> {

        if ( this.loading === true ) {
        
        }

        // Perform the fetches
        const result = await Promise.all(
            this._requests.map(request => request.fetch())
        );

        // Process the requests
        for (let response of result) {

            if (response !== null) {

                // This makes sure that there are no duplicite sources
                const file = this.registry.manager.registerSource(response.file);

                // Add the request in the group in a unified way
                response.request.group.instances.instantiateSource(file);

            }

        }

        return this.registry.groups.value;

    }

}