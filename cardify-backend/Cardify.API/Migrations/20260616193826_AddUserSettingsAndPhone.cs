using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cardify.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserSettingsAndPhone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpendingAlerts = table.Column<bool>(type: "bit", nullable: false),
                    BudgetWarnings = table.Column<bool>(type: "bit", nullable: false),
                    AiInsightsNotifications = table.Column<bool>(type: "bit", nullable: false),
                    WeeklyReport = table.Column<bool>(type: "bit", nullable: false),
                    UnusualActivity = table.Column<bool>(type: "bit", nullable: false),
                    AutoInsights = table.Column<bool>(type: "bit", nullable: false),
                    SpendingPredictions = table.Column<bool>(type: "bit", nullable: false),
                    AnomalyDetection = table.Column<bool>(type: "bit", nullable: false),
                    Personalisation = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSettings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserSettings_UserId",
                table: "UserSettings",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserSettings");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Users");
        }
    }
}
