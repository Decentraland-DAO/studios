


function generateSiteMap(paths) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://studios.decentraland.org</loc>
     </url>
     <url>
       <loc>https://studios.decentraland.org/jobs</loc>
     </url>
     <url>
       <loc>https://studios.decentraland.org/studios</loc>
     </url>
     <url>
       <loc>https://studios.decentraland.org/projects</loc>
     </url>
     <url>
       <loc>https://studios.decentraland.org/resources</loc>
     </url>
     ${paths
            .map((path) => {
                return `
       <url>
           <loc>${`https://studios.decentraland.org/${path}`}</loc>
       </url>
     `;
            })
            .join('')}
   </urlset>
 `;
}

async function writeSitemap() {
  //TODO: make dynamic site sections, handle db fetch errors?

    console.log('Generating public/sitemap.xml')

    const fs = require("fs")

    const DB_URL = `${process.env.NEXT_PUBLIC_PARTNERS_DATA_URL}`

    const partnersPaths = (await (await fetch(`${DB_URL}/items/profile?fields=slug&limit=-1`)).json()).data.map((item) => `profile/${item.slug}`)

    const projectsPaths = (await (await fetch(`${DB_URL}/items/projects?fields=id&limit=-1`)).json()).data.map((item) => `project/${item.id}`)

    const guidesPaths = (await (await fetch(`${DB_URL}/items/landings?fields=slug&limit=-1`)).json()).data.map((item) => `p/${item.slug}`)

    const sitemap = generateSiteMap([...partnersPaths, ...projectsPaths, ...guidesPaths]);


    fs.writeFileSync('public/sitemap.xml', sitemap)
}

writeSitemap()