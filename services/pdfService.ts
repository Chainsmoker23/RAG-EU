
// This assumes jspdf is loaded via CDN
declare const jspdf: any;

export const generatePdfFromHtml = (htmlContent: string, title: string) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
    });

    // Create a container to render the HTML for PDF conversion
    const container = document.createElement('div');
    container.style.width = '446px'; // A4 width in pixels at 96 DPI minus margins
    container.style.padding = '20px';
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    doc.html(container, {
        callback: function (doc: any) {
            doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
            document.body.removeChild(container);
        },
        x: 10,
        y: 10,
        margin: [20, 20, 20, 20],
        autoPaging: 'text',
        width: 446, 
        windowWidth: 446,
    });
};

export const createReportHtml = (title: string, reportMarkdown: string) => {
    // A very basic markdown to HTML converter
    const toHtml = (md: string) => {
        return md
            .replace(/^# (.*$)/gim, '<h1 style="font-size: 24px; color: #003399; border-bottom: 2px solid #FFCC00; padding-bottom: 5px; margin-top: 20px;">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 style="font-size: 20px; color: #003399; margin-top: 15px;">$1</h2>')
            .replace(/^\*\*(.*)\*\*/gim, '<h3 style="font-size: 16px; color: #333; margin-top: 10px;">$1</h3>')
            .replace(/\n/g, '<br />');
    };

    return `
        <div style="font-family: sans-serif; color: #333;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 28px; color: #003399; margin: 0;">EU TRANSPORTATION POLICY REPORT</h1>
                <p style="font-size: 20px; color: #555; margin-top: 5px;">${title}</p>
                <p style="font-size: 12px; color: #777;">Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div>
                ${toHtml(reportMarkdown)}
            </div>
        </div>
    `;
};
