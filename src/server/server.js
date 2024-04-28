import express from 'express'
import path from 'path'

export const startServer = (options) => {
    const { port, public_path = 'public' } = options

    const app = express()

    // Poder usar Middelewares se usa la palabra (express).
    app.use(express.static(public_path)) // contenido statico disponible

    app.get('*', (req, res) => {
        const indexPath = path.join(__dirname, `../../../${public_path}/index.html`)
        res.sendFile(indexPath)
    })

    app.listen(port, () => {
        console.log(`...Escuchando en el puerto ${port}`)
    })
}
