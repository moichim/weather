import { TimeFormat } from "@/state/time/reducerInternals/timeUtils/formatting";
import { ThermalFileInstance } from "../ThermalFileInstance";
import { AbstractLayer } from "./AbstractLayer";
import ThermalDomFactory from "./domFactories";
import { differenceInHours, differenceInMinutes } from "date-fns";

export class ThermalDateLayer extends AbstractLayer {

    protected container: HTMLDivElement;
    protected inner: HTMLDivElement;

    public constructor(
        instance: ThermalFileInstance
    ) {
        super( instance );

        this.container = ThermalDomFactory.createDateLayer();
        this.inner = ThermalDomFactory.createDateLayerInner();
        this.inner.innerHTML = `${TimeFormat.humanDate(this.instance.timestamp)} - ${TimeFormat.humanTime( this.instance.timestamp )}`;
        this.container.appendChild( this.inner );
    }

    protected getContent() {

        if ( this.instance.isHover ) {
            return `<strong>${TimeFormat.humanDate(this.instance.timestamp)}</strong> <span style="opacity:.7">${TimeFormat.humanTime( this.instance.timestamp )}</span>`;
        }

        
        if ( this.instance.group.registry.hightlightTime ) {
            const difference = differenceInMinutes(this.instance.timestamp, this.instance.group.registry.hightlightTime);
            return `${difference < 0 ? "" : "+"}${difference} minut <span style="opacity:.7">${TimeFormat.humanTime(this.instance.timestamp)}</span>`;
        }

        return "neznámý časový rozdíl";

    }

    public show() {
        this.inner.innerHTML = this.getContent();
        this.inner.style.top = "-1.9rem";
        this.inner.style.opacity = "1";
        // this.inner.style.transform = "scale(1)";
    }

    public hide() {
        this.inner.style.top = "0rem";
        this.inner.style.opacity = "0";
        // this.inner.style.transform = "scale(.5)";
    }

    public getLayerRoot(): HTMLElement {
        return this.container;
    }
    protected onDestroy(): void {
        this.inner.remove();
        this.container.remove();
    }

}