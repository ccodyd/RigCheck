import { renderToBuffer, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { Estimate, LineItem } from "./types";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", padding: 48, backgroundColor: "#ffffff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, paddingBottom: 20, borderBottom: "1 solid #e5e7eb" },
  logo: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#f59e0b" },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#6b7280" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottom: "0.5 solid #f3f4f6" },
  label: { color: "#6b7280" },
  value: { fontFamily: "Helvetica-Bold" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f9fafb", padding: "6 8", marginBottom: 2, borderRadius: 3 },
  tableRow: { flexDirection: "row", padding: "5 8", borderBottom: "0.5 solid #f3f4f6" },
  th: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#6b7280", textTransform: "uppercase" },
  td: { fontSize: 9.5 },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", paddingTop: 10, marginTop: 6, borderTop: "1 solid #e5e7eb" },
  totalLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", marginRight: 20 },
  totalValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#111827" },
  footer: { position: "absolute", bottom: 32, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between", color: "#9ca3af", fontSize: 8 },
  badge: { backgroundColor: "#fef3c7", color: "#92400e", padding: "3 8", borderRadius: 4, fontSize: 9, fontFamily: "Helvetica-Bold" },
});

const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

function EstimatePdf({ estimate }: { estimate: Estimate & { estimate_line_items?: LineItem[]; vehicles?: { year?: number; make?: string; model?: string; vin?: string } } }) {
  const lineItems: LineItem[] = estimate.estimate_line_items ?? [];
  const vehicle = estimate.vehicles;
  const laborRate = (estimate as { labor_rate?: number }).labor_rate ?? 149;
  const totalParts = lineItems.reduce((s, i) => s + (i.partCost ?? 0), 0);
  const totalLabor = lineItems.reduce((s, i) => s + i.hours * laborRate, 0);
  const grandTotal = totalParts + totalLabor;

  return (
    <Document title={`RigCheck Estimate ${(estimate as { estimate_number?: string }).estimate_number ?? estimate.id}`}>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>RigCheck</Text>
            <Text style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}>AI Truck Repair Estimator · rigcheck.app</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.title}>{(estimate as { estimate_number?: string }).estimate_number ?? "Estimate"}</Text>
            <Text style={styles.subtitle}>Generated {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</Text>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.badge}>TIER 2 · FULL REPORT</Text>
            </View>
          </View>
        </View>

        {/* Vehicle info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle</Text>
          {vehicle && (
            <View>
              <View style={styles.row}><Text style={styles.label}>Year / Make / Model</Text><Text style={styles.value}>{vehicle.year} {vehicle.make} {vehicle.model}</Text></View>
              <View style={styles.row}><Text style={styles.label}>VIN</Text><Text style={styles.value}>{vehicle.vin}</Text></View>
            </View>
          )}
          <View style={styles.row}><Text style={styles.label}>Severity</Text><Text style={styles.value}>{estimate.severity}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Confidence</Text><Text style={styles.value}>{estimate.confidence ? `${Math.round(estimate.confidence * 100)}%` : "—"}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Teardown recommended</Text><Text style={styles.value}>{estimate.teardown ? "Yes" : "No"}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Range (Tier 1)</Text><Text style={styles.value}>{estimate.tier1Low && estimate.tier1High ? `${fmt(estimate.tier1Low)} – ${fmt(estimate.tier1High)}` : "—"}</Text></View>
        </View>

        {/* Line items */}
        {lineItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Line-Item Breakdown</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 3 }]}>Part / Operation</Text>
              <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Parts</Text>
              <Text style={[styles.th, { flex: 0.7, textAlign: "right" }]}>Hrs</Text>
              <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Labor</Text>
            </View>
            {lineItems.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={{ flex: 3 }}>
                  <Text style={styles.td}>{item.part}</Text>
                  <Text style={{ fontSize: 8.5, color: "#6b7280" }}>{item.action}</Text>
                </View>
                <Text style={[styles.td, { flex: 1, textAlign: "right" }]}>{item.partCost != null ? fmt(item.partCost) : "—"}</Text>
                <Text style={[styles.td, { flex: 0.7, textAlign: "right" }]}>{item.hours.toFixed(1)}</Text>
                <Text style={[styles.td, { flex: 1, textAlign: "right" }]}>{fmt(item.hours * laborRate)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Parts {fmt(totalParts)} + Labor {fmt(totalLabor)}</Text>
              <Text style={styles.totalValue}>{fmt(grandTotal)}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>RigCheck · rigcheck.app · AI-generated estimate for reference only</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

export async function generateEstimatePdf(estimate: Parameters<typeof EstimatePdf>[0]["estimate"]): Promise<Buffer> {
  return renderToBuffer(<EstimatePdf estimate={estimate} />);
}
