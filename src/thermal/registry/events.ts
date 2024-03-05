import { ThermalGroup } from "./ThermalGroup";

export interface RegistryEventDetails {}
export interface RegistryEvent<D extends RegistryEventDetails = RegistryEventDetails> extends CustomEvent<D> {}

export interface GroupEventDetails {}
export interface GroupEvent<D extends GroupEventDetails = GroupEventDetails> extends CustomEvent<D> {}

export interface SourceEventDetails {}
export interface SourceEvent<D extends SourceEventDetails = SourceEventDetails> extends CustomEvent<D> {}

export interface InstanceEventDetails {}
export interface InstanceEvent<D extends InstanceEventDetails =InstanceEventDetails> extends CustomEvent<D> {}

// RegistryEvents
interface RegistryGroupInitialisedEventDetails { group: ThermalGroup }
export interface RegistryGroupInitialisedEvent extends RegistryEvent<RegistryGroupInitialisedEventDetails> {
    
}