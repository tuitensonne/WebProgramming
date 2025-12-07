<?php
namespace App\Controllers;

use App\Core\Controller;
use App\Models\ContactModel;
use App\Services\phpMailerService;

class ContactController extends Controller
{
    private ContactModel $contactModel;

    public function __construct()
    {
        $this->contactModel = new ContactModel();
    }

    public function delete($id) {
        if (!$id || !is_numeric($id)) {
            return $this->error("Invalid contact ID", 400);
        }

        try {
            $deleted = $this->contactModel->delete((int) $id);

            if (!$deleted) {
                return $this->error(
                    "Contact not found or failed to delete",
                    404
                );
            }

            return $this->success(null, "Contact deleted successfully");
        } catch (\Exception $e) {
            return $this->error(
                "Failed to contact section",
                500,
                $e->getMessage()
            );
        }
    }

    public function updateStatus($id)
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            error_log("=== STATUS === " . json_encode($data));

            if (!isset($data['status'])) {
                return $this->error("Missing status field", 400);
            }

            $status = $data['status'];

            $updated = $this->contactModel->updateStatus($id, $status);

            if (!$updated) {
                return $this->error(
                    "Failed to update status for this contact message",
                    500
                );
            }

            return $this->success("Updated contact message successfully");

        } catch (\Exception $e) {
            return $this->error("Server error", 500, $e->getMessage());
        }
    }

    public function getAllContacts() {
        try {
            $offset = isset($_GET["offset"]) ? (int) $_GET["offset"] : 0;
            $limit  = isset($_GET["limit"]) ? (int) $_GET["limit"] : 10;

            $search = $_GET["search"] ?? null;
            $status = $_GET["status"] ?? null;

            $contacts = $this->contactModel->getAllContacts($offset, $limit, $search, $status);

            return $this->success($contacts, "Fetched contacts successfully");
        } catch (\Exception $e) {
            return $this->error("Failed to fetch contacts", 500, $e->getMessage());
        }
    }

    public function replyMail($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['to']) || !isset($data['subject']) || !isset($data['body'])) {
            return $this->error("Missing required fields", 400);
        }

        try {
            $mailer = phpMailerService::getInstance();
            $success = $mailer->sendMail($data['to'], $data['subject'], $data['body']);

            if (!$success) {
                return $this->error("Failed to send mail", 500);
            }

            $saved = $this->contactModel->saveMail($id, $data['body']);

            if (!$saved) {
                return $this->error("Mail sent but failed to save reply", 500);
            }

            return $this->success("Mail sent & reply saved successfully");

        } catch (\Exception $e) {
            return $this->error("Server error", 500, $e->getMessage());
        }
    }

    public function create()
    {
        $data = $_POST ?: json_decode(file_get_contents('php://input'), true);

        if (empty($data['email'])) {
            return $this->error('Missing required fields: email', 400);
        }

        try {
            $id = $this->contactModel->create($data);

            if (!$id) {
                return $this->error('Failed to create contact', 500);
            }

            return $this->success(['id' => $id], 'Contact created successfully');
        } catch (\Exception $e) {
            return $this->error('Server error', 500, $e->getMessage());
        }
    }
}
