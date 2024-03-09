function OrderStatusBar({ currentStatus }) {
    const statusStages = [
        { key: 1, label: "Đang xử lý", className: "processing" },
        { key: 2, label: "Đã duyệt", className: "approved" },
        { key: 3, label: "Đang giao", className: "delivering" },
        { key: 4, label: "Hoàn thành", className: "completed" }
    ];

    return (
        <div className="order-status-bar">
            {statusStages.map((stage) => (
                <div key={stage.key} className={`status-stage ${stage.className} ${currentStatus >= stage.key ? 'active' : ''}`}>
                    <span className="status-label">{stage.label}</span>
                </div>
            ))}
        </div>
    );
}
export default OrderStatusBar;