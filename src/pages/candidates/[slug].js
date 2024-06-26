import { fetchCsv } from '../../utils/fetchCsv';
import Head from 'next/head';
import { useEffect, useState, useReducer, lazy, Suspense } from "react";
import reducer, { initialState } from "../../reducer";
import { MapContext, HotelContext } from "../../context";
import Layout from '@components/Layout';
import { generateImage } from 'src/img_gen';
import { config } from 'src/config';

const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQr3xG4WxuzMC3G4sDDpdFlBT9EdOuyjTw2Xd_HHYnKzs-ptHuXH4bpH67Z1fDOiDFE0qaIYZ1OUP9x/pub?gid=0&single=true&output=csv'

export async function getStaticPaths() {
  const records = await fetchCsv(url);

  const paths = records.map(item => ({
    params: { slug: item.id.toLowerCase().replace(/ /g, '-') },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const records = await fetchCsv(url);

  const pageData = records.find(item => item.id.toLowerCase().replace(/ /g, '-') === params.slug);

  const ogImage = await generateImage({
    outputName: pageData.id,
    options: {
      width: 1200,
      height: 630,
      img: pageData.img,
      name: pageData.name,
      description: pageData.program,
    }
  })

  return {
    props: { pageData, ogImage, records },
  };
}

export default function Page({ pageData, ogImage, records, props }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mapData = { ...state, dispatch };
  const [hotels, setHotels] = useState(records);

  return (
    <>
      <HotelContext.Provider value={{ hotels }}>
        <MapContext.Provider value={mapData}>
        <Layout {...props} >
        <Head>
        <title>{pageData.name}</title>
        <meta name="description" content={'todo'} />
        <meta property="og:title" content={pageData.name} />
        <meta property="og:description" content={'todo'} />
        <meta property="og:image" content={config.prefix+'/'+ogImage} />
        {/* <meta property="og:url" content="" /> */}
        <meta property="og:type" content="website" />
      </Head>

      <div style={{position: 'relative'}}>
        <h1 style={{marginBottom: "4px"}}>{pageData.name}</h1>
        <p style={{marginTop: "0"}}>{pageData.district}</p>
        <img src={pageData.img} width="400"></img>
        <p style={{marginTop: "0"}}>{pageData.organisation} jelöltje</p>
        <h2 style={{marginBottom: "0"}}>Program</h2>
        <p>{pageData.program}</p>
        <h2 style={{marginBottom: "0"}}>Problémák</h2>
        <p>{pageData.problems}</p>
        <h2 style={{marginBottom: "0"}}>Részletek</h2>
        <p>{pageData.details}</p>
      </div>
      </Layout>
      </MapContext.Provider>
    </HotelContext.Provider>
    <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 0 20px;
        }

        main {
          text-align: center;
        }

        h1 {
          font-size: 2em;
          color: #333;
        }

        p {
          font-size: 1.2em;
          color: #555;
        }
      `}</style>

    </>
  );
}
