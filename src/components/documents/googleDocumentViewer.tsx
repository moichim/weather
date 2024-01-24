import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider"
import { google } from "googleapis";
import Link from "next/link";

type  ValueType<T> = T extends Promise<infer U> ? U : T;

// type GoogleDocument = ReturnType<typeof googleSheetsProvider["getDocument"]>;

type GoogleDocument = ValueType< ReturnType<typeof googleSheetsProvider["getDocument"]> >;


const parse = ( document: GoogleDocument ) => {

    const content = document.data.body?.content;
    if ( ! content ) return undefined;

    const markup: JSX.Element[] = [];

    content.forEach( ( partial, index)  => {

        if ( "paragraph" in partial ) {

            const paragraph = partial.paragraph;

            if ( paragraph ) {

                const elements = paragraph.elements;

                if (elements) {

                    const div: JSX.Element[] = []

                    elements.forEach( (entry,index) => {

                        const textRun = entry.textRun;

                        if ( textRun ) {

                            const content = textRun.content;

                            const type: "paragraph"|"link"|"heading" = "paragraph";

                            const key = `item-${content}-${index}`;

                            // Find out if this is a link

                            let link: string|null = null;

                            if ( textRun.textStyle ) {
                                if ( textRun.textStyle.link ) {
                                    if ( textRun.textStyle.link.url)
                                        link = textRun.textStyle.link.url;
                                }
                            }

                            if ( link ) {
                                div.push( <Link key={key}href={link} target="_blank">{content}</Link> );
                                return;
                            }


                            if ( "paragraphStyle" in paragraph ) {

                                const style = paragraph.paragraphStyle as any;

                                if ( "namedStyleType" in style ) {

                                    if (style.namedStyleType === "HEADING_1") {
                                        div.push( <h1 key={key}>{content}</h1> );
                                        return;
                                    } 

                                    if (style.namedStyleType === "HEADING_2") {
                                        div.push( <h2 key={key}>{content}</h2> );
                                        return;
                                    }

                                    if (style.namedStyleType === "HEADING_3") {
                                        div.push( <h3 key={key}>{content}</h3> );
                                        return;
                                    } 

                                }

                            }

                            if ( content ) {
                                div.push( <span key={key}>{content}</span>)
                            }

                        }

                    } );

                    markup.push( <div key={`partial-${index}`}>{div}</div> );

                }

            }

        }

    } );

    return markup;

}

export async function GoogleDocsViewer() {

    const document = await googleSheetsProvider.getDocument();

    const markup = parse( document );

    return <div>
        {markup}
    </div>
}