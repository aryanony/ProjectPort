// src/components/SidebarPricing.jsx - Enhanced with Beautiful Quote
import React from "react";
import jsPDF from "jspdf";

export default function SidebarPricing({ estimate = {}, projectMeta = {}, onDownload, typeKey = '', formData = {} }) {

    const generateBeautifulQuote = () => {
        try {
            const doc = new jsPDF({
                unit: "mm",
                format: "a4"
            });

            const pageWidth = 210;
            const pageHeight = 297;

            // Colors from your theme
            const primaryColor = [18, 107, 100]; // #126b64
            const secondaryColor = [244, 65, 66]; // #f44142
            const accentColor = [11, 41, 60]; // #0b293c
            const textColor = [30, 30, 47]; // #1E1E2F

            // Header with gradient effect
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, pageWidth, 40, 'F');

            // Company name/logo area
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.text('ProjectPort', 15, 20);

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text('Empowering Digital Service Ecosystems', 15, 28);

            // Quote title
            doc.setFillColor(...secondaryColor);
            doc.rect(0, 40, pageWidth, 15, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('PROJECT QUOTATION', pageWidth / 2, 50, { align: 'center' });

            // Reset to black text
            doc.setTextColor(...textColor);
            let yPos = 70;

            // Project Information Box
            doc.setFillColor(245, 247, 250);
            doc.roundedRect(15, yPos, pageWidth - 30, 45, 3, 3, 'F');

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Project Overview', 20, yPos + 8);

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(...textColor);

            yPos += 15;
            doc.text('Project Name:', 20, yPos);
            doc.setFont(undefined, 'bold');
            doc.text(projectMeta.projectName || 'Not specified', 55, yPos);

            yPos += 7;
            doc.setFont(undefined, 'normal');
            doc.text('Project Type:', 20, yPos);
            doc.setFont(undefined, 'bold');
            doc.text(formData.typeLabel || 'Not specified', 55, yPos);

            yPos += 7;
            doc.setFont(undefined, 'normal');
            doc.text('Tech Stack:', 20, yPos);
            doc.setFont(undefined, 'bold');
            doc.text(formData.techStack || 'Not specified', 55, yPos);

            yPos += 7;
            doc.setFont(undefined, 'normal');
            doc.text('Estimated Duration:', 20, yPos);
            doc.setFont(undefined, 'bold');
            doc.text(`${formData.estimatedTimeWeeks || 4} weeks`, 55, yPos);

            yPos += 20;

            // Description
            if (formData.description) {
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(...primaryColor);
                doc.text('Project Description', 20, yPos);

                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(...textColor);
                const descLines = doc.splitTextToSize(formData.description, pageWidth - 40);
                doc.text(descLines, 20, yPos + 7);
                yPos += descLines.length * 5 + 15;
            }

            // Price Breakdown
            doc.setFillColor(245, 247, 250);
            doc.roundedRect(15, yPos, pageWidth - 30, 60, 3, 3, 'F');

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Price Breakdown', 20, yPos + 8);

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(...textColor);

            yPos += 18;
            doc.text('Base Price:', 20, yPos);
            doc.text(`₹ ${estimate.base?.toLocaleString() || 0}`, pageWidth - 20, yPos, { align: 'right' });

            yPos += 7;
            doc.text('Add-ons (Flat):', 20, yPos);
            doc.text(`₹ ${estimate.addonsFlat?.toLocaleString() || 0}`, pageWidth - 20, yPos, { align: 'right' });

            yPos += 7;
            doc.text(`Add-ons (${estimate.addonsPct || 0}%):`, 20, yPos);
            doc.text(`₹ ${estimate.pctAmount?.toLocaleString() || 0}`, pageWidth - 20, yPos, { align: 'right' });

            yPos += 7;
            doc.text('Modules:', 20, yPos);
            doc.text(`₹ ${estimate.moduleFlat?.toLocaleString() || 0}`, pageWidth - 20, yPos, { align: 'right' });

            // Divider line
            yPos += 5;
            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(0.5);
            doc.line(20, yPos, pageWidth - 20, yPos);

            // Total
            yPos += 7;
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...secondaryColor);
            doc.text('Estimated Total:', 20, yPos);
            doc.text(`₹ ${estimate.final?.toLocaleString() || 0}`, pageWidth - 20, yPos, { align: 'right' });

            yPos += 8;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(...textColor);
            doc.text(`Price Range: ₹ ${estimate.suggestedMin?.toLocaleString() || 0} - ₹ ${estimate.suggestedMax?.toLocaleString() || 0}`, 20, yPos);

            yPos += 20;

            // Selected Features
            if (formData.modules && formData.modules.length > 0) {
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(...primaryColor);
                doc.text('Selected Modules', 20, yPos);

                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(...textColor);
                yPos += 7;

                formData.modules.forEach((module, index) => {
                    doc.text(`• ${module}`, 25, yPos);
                    yPos += 5;
                    if (yPos > 260) {
                        doc.addPage();
                        yPos = 20;
                    }
                });
                yPos += 5;
            }

            if (formData.resources && formData.resources.length > 0) {
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(...primaryColor);
                doc.text('Required Resources', 20, yPos);

                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(...textColor);
                yPos += 7;

                formData.resources.forEach((resource, index) => {
                    doc.text(`• ${resource}`, 25, yPos);
                    yPos += 5;
                    if (yPos > 260) {
                        doc.addPage();
                        yPos = 20;
                    }
                });
                yPos += 5;
            }

            // Footer
            const footerY = pageHeight - 20;
            doc.setFillColor(...accentColor);
            doc.rect(0, footerY - 10, pageWidth, 30, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.text('Thank you for choosing ProjectPort!', pageWidth / 2, footerY, { align: 'center' });
            doc.text('This quote is valid for 30 days from the date of generation.', pageWidth / 2, footerY + 5, { align: 'center' });
            doc.setFontSize(8);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, footerY + 10, { align: 'center' });

            // Save the PDF
            const filename = `${(projectMeta.projectName || 'ProjectPort_Quote').replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
            doc.save(filename);

        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Failed to generate quote. Please try again.');
        }
    };

    return (
        <aside className="w-full md:w-80 sticky top-20 self-start">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4 shadow-sm">
                <h4 className="mb-2 font-[var(--font-weight-lg)] font-[var(--font-heading)] text-[18px] md:text-[20px]">Pricing Summary</h4>

                <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mb-3">Live estimate based on your selections</div>

                <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Base</span>
                        <span className="font-[var(--font-heading)]">₹ {estimate.base?.toLocaleString() ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Add-ons (flat)</span>
                        <span>₹ {estimate.addonsFlat?.toLocaleString() ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Add-ons (%)</span>
                        <span>{estimate.addonsPct ?? 0}% (₹ {estimate.pctAmount?.toLocaleString() ?? 0})</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-sm)] text-[var(--color-tx-muted)]">Modules</span>
                        <span>₹ {estimate.moduleFlat?.toLocaleString() ?? 0}</span>
                    </div>
                </div>

                <div className="border-t border-[var(--color-border)] pt-3 mb-3">
                    <div className="flex justify-between items-center">
                        <span className="font-[var(--font-heading)]">Estimated Total</span>
                        <span className="text-[var(--text-lg)] font-[var(--font-weight-lg)]">₹ {estimate.final?.toLocaleString() ?? 0}</span>
                    </div>
                    <div className="text-[var(--text-sm)] text-[var(--color-tx-muted)] mt-2">
                        Range: ₹ {estimate.suggestedMin?.toLocaleString() ?? 0} - ₹ {estimate.suggestedMax?.toLocaleString() ?? 0}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={generateBeautifulQuote}
                        className="flex-1 px-3 py-2 bg-[var(--color-primary)] text-white rounded-md cursor-pointer hover:opacity-90 transition text-sm font-medium"
                        title="Download Detailed Quote"
                    >
                        Get Project Report
                    </button>
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: `Quote for ${projectMeta.projectName || "project"}`,
                                    text: `Estimated: ₹ ${estimate.final?.toLocaleString() ?? 0}`,
                                });
                            } else {
                                alert("Share not supported on this device");
                            }
                        }}
                        className="px-3 py-2 border border-[var(--color-border)] rounded-md cursor-pointer hover:bg-gray-50 transition"
                        title="Share quote"
                    >
                        Share
                    </button>
                </div>
            </div>

            <div className="mt-4 text-[var(--text-sm)] text-[var(--color-tx-muted)]">
                <strong>Tip:</strong> Download your detailed project report to see complete breakdown
            </div>
        </aside>
    );
}